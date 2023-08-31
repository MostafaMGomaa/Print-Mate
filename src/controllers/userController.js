const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const User = require('../models/userModel');
const Email = require('../helpers/Email');
const AppError = require('../helpers/appError');
const isUnEmail = require('../helpers/isUnEmail');
const { generateToken } = require('../helpers/tokenHandler');
const { getAll, getOne, deleteOne, updateOne } = require('./crudFactory');

exports.getAllUsers = getAll(User);
exports.getOneUser = getOne(User);
exports.deleteOneUser = deleteOne(User);
exports.updateOneUser = updateOne(User);

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) return next(new AppError('User already exists', 403));

  const newUser = await User.create({ ...req.body, role: 'user' });
  const token = generateToken(newUser, res);

  res.status(201).json({
    status: 'success',
    token,
    newUser,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return next(new AppError('User not found!', 404));

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return next(new AppError('Invalid email or password', 403));

  const token = generateToken(user, res);

  res.status(201).json({
    status: 'success',
    token,
    user,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res
    .status(201)
    .json({ status: 'success', message: 'Logged out successfully' });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user)
    return next(new AppError('Cannot find any users with this email', 404));

  const resetToken = crypto.randomBytes(4).toString('hex');

  user.passwordChangedAt = Date.now();
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); //link will be expired after 10 min;

  await user.save();

  await new Email(user.email, resetToken).restPassword();

  res.status(200).json({
    status: 'success',
    message: 'Token sent to your email',
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: { passwordResetToken: req.params.token },
  });

  if (!user) return next(new AppError('Invalid Token', 404));
  if (user.resetTokenExpires >= Date.now())
    return next(new AppError('link has been expired', 401));
  if (req.body.password != req.body.passwordConfirm)
    return next(new AppError("password doesn't match", 400));

  const hashedPass = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPass;
  user.passwordConfirm = null;
  user.passwordResetToken = null;
  user.resetTokenExpires = null;

  await user.save();
  res.status(200).json({ message: 'Password changed' });
});
