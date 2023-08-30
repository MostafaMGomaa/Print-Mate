const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const validator = require('express-validator');

const User = require('../models/userModel');
const AppError = require('../helpers/appError');
const isUnEmail = require('../helpers/isUnEmail');
const generateToken = require('../helpers/GenerateToken');

const { getAll, getOne } = require('./crudFactory');

exports.getAllUsers = getAll(User);
exports.getOneUser = getOne(User);

exports.createOneUser = asyncHandler(async (req, res, next) => {
  //validate email
  const isEmail = await validator
    .not()
    .isEmail(req.body.email)
    .withMessage('Invalid Email format');
  if (!isEmail) return next(new AppError('Invalid Email format', 400));

  //validate university email
  const UnEmail = isUnEmail(req.body.email);
  if (!UnEmail) return next(new AppError('University email is required', 400));

  //sure that user doesn't exist
  const user = User.findOne({ where: { email: req.body.email } });
  if (user) return next(new AppError('User aleardy exists', 403));

  const newUser = await User.create(req.body);
  const token = generateToken(user, res);

  res.status(201).json({
    status: 'success',
    token,
    newUser,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const validEmail = await validator.isEmail(req.body.email);
  const validPass = await bcrypt.compare(req.body.email, User.password);
  if (!validPass || !validEmail)
    return next(new AppError('Invalid email or password', 403));

  const user = User.findOne({ where: { email: req.body.email } });

  if (!user) return next(new AppError('User not found!', 404));

  const token = generateToken(user, res);

  res.status(201).json({
    status: 'success',
    user,
    token,
  });
});

exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: 'Logged out successfully' });
});
