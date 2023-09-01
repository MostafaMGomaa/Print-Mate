const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/userModel');
const Email = require('../helpers/Email');
const AppError = require('../helpers/appError');
const { isUnEmail } = require('../helpers/middlewares');
const { generateJWT, isVaildUserToken } = require('../helpers/auth');
const { getAll, getOne, deleteOne, updateOne } = require('./crudFactory');

exports.getAllUsers = getAll(User);
exports.getOneUser = getOne(User);
exports.deleteOneUser = deleteOne(User);
exports.updateOneUser = updateOne(User);

exports.signup = asyncHandler(async (req, res, next) => {
  // if (!isUnEmail(req.body.email))
  //   return next(new AppError('Invaild email', 400));

  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) return next(new AppError('User already exists', 403));

  const newUser = await User.create({ ...req.body, role: 'user' });
  const token = generateJWT(newUser, res);

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

  const token = generateJWT(user, res);

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
  if (!user) return next(new AppError('Cannot find any users', 404));

  const resetToken = crypto.randomBytes(4).toString('hex');

  user.passwordChangedAt = Date.now();
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); //link will be expired after 10 min;

  await user.save();

  try {
    await new Email(user.email, resetToken).restPassword();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email',
    });
  } catch (err) {
    console.error(err);

    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const user = await isVaildUserToken(req, res, next);

    if (!user) return next(new AppError('Cannot find any users', 404));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password changed' });
  } catch (error) {
    next(error);
  }
});

exports.verifyToken = asyncHandler(async (req, res, next) => {
  const user = await isVaildUserToken(req, res, next);

  if (!user)
    return next(new AppError('Token is invalied or has expired!', 400));

  res.status(200).json({
    status: 'success',
  });
});
