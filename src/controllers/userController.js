const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendMail = require('../helpers/sendMail');

const User = require('../models/userModel');
const AppError = require('../helpers/appError');
const isUnEmail = require('../helpers/isUnEmail');
const {generateToken} = require('../helpers/tokenHandler');

const { getAll, getOne , deleteOne, updateOne} = require('./crudFactory');
const validator = require('validator');

exports.getAllUsers   = getAll(User);
exports.getOneUser    = getOne(User);
exports.deleteOneUser = deleteOne(User);
exports.updateOneUser = updateOne(User);

exports.signup = asyncHandler(async (req, res, next) => {
  //validate email
  const isEmail =  validator.isEmail(req.body.email);
  if (!isEmail) return next(new AppError('Invalid Email format', 400));

  //validate university email
  const UnEmail = isUnEmail(req.body.email);
  if (!UnEmail) return next(new AppError('University email is required', 400));

  //sure that user doesn't exist
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user ) return next(new AppError('User already exists', 403));
  
  if(req.body.passwordConfirm != req.body.password) 
  return next(new AppError('password does not match'));
  
  const newUser = await User.create(req.body);
  const token = generateToken(newUser, res);

  res.status(201).json({
    status: 'success',
    token,
    newUser,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const validEmail = await validator.isEmail(req.body.email);
  if(!validEmail)
     return next(new AppError('Invalid email or password', 403));
    
  const user = await User.findOne({ where: { email: req.body.email } });
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass || !validEmail)
    return next(new AppError('Invalid email or password', 403));


  if (!user) return next(new AppError('User not found!', 404));

  const token = generateToken(user, res);

  res.status(201).json({
    status: 'success',
    user,
    token,
  });
});


exports.logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(201).json({ message: 'Logged out successfully' });
});

exports.forgotPassword =  asyncHandler(async (req, res, next) => {
  const userEmail = req.body.email;
  if(!userEmail) return next(new AppError('Email is required', 400));

  const user = await User.findOne({where: {email: userEmail}});
  if(!user) return next(new AppError('Invalid email', 400));

  const token = await crypto.randomBytes(32).toString('hex');
  const expiredLink = Date.now() + 45 * 60 * 1000 //link will be expired after 45 min

  user.passwordChangedAt    = Date.now();
  user.passwordResetToken   = token;
  user.passwordResetExpires = expiredLink;

  await user.save();
  await sendMail(user,res);
});

exports.resetPassword =  asyncHandler(async (req, res, next) => {
  const user = await User.findOne({where : {passwordResetToken: req.params.token}});

  if(!user)  return next(new AppError('Invalid Token', 404));
  if(user.resetTokenExpires >= Date.now()) return next(new AppError('link has been expired', 401)); 
  if(req.body.password != req.body.passwordConfirm)return next(new AppError("password doesn't match", 400));
  
  const hashedPass = await bcrypt.hash(req.body.password, 10);
  user.password           = hashedPass;
  user.passwordConfirm    = null;
  user.passwordResetToken = null;
  user.resetTokenExpires  = null;

  await user.save();
  res.status(200).json({message:'Password changed'});
});