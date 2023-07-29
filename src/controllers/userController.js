const User         = require('../models/userModel');

const asyncHandler  = require('express-async-handler');
const bcrypt        = require('bcryptjs')
const validator     = require('express-validator');
const AppError      = require('../helpers/appError');
const isUnEmail     = require('../helpers/isUnEmail');
const generateToken = require('../helpers/GenerateToken');

const {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} = require('./hanleOps');

exports.getAllUsers = getAll(User);
exports.getOneUser = getOne(User);
// All This controller below for test only .
exports.deleteOneUser = deleteOne(User);
exports.updateOneUser = updateOne(User);

exports.createOneUser = asyncHandler(async(req, res, next)=>{
  //validate email
  const isEmail = await validator.isEmail(req.body.email);
  if(! isEmail){ return next(new AppError('Invalid Email formate', 400)); };

  //validate university email 
  const UnEmail = await isUnEmail(req.body.email);
  if(!UnEmail){ return next(new AppError('University email is required', 400)); };

  //sure that user doesn't exist
  const user = User.findOne({ where : { email : req.body.email}  })
  if(user){return next(new AppError('User aleardy exists', 400)); }
  
  user = await User.create(req.body);
  const token = generateToken(user, res);

  res.status(201).json({
    status: 'success',
    user,
    token
  });
  
});

exports.auth = asyncHandler(async(req, res, next)=>{

  const validEmail = await validator.isEmail(req.body.email);  
  const validPass = await bcrypt.compare(req.body.email, User.password);

  if(! validPass || !validEmail){ return next(new AppError('Invalid email or password', 400)); };
  
  const user = User.findOne({ where : { email : req.body.email}  })
  if(!user){return next(new AppError('User not found!', 404)); }

  const token = generateToken(user, res);
  res.status(201).json({
    status: 'success',
    user,
    token
  });
  
});

exports.logOut = asyncHandler(async(req, res, next)=>{
  res.cookie('jwt', '', { 
    httpOnly: true,
    expires: new Date(0)
  });

  res.json({"message": "Logged out successfully"});
});
