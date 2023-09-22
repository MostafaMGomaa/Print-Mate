const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { promisify } = require('util');

const User = require('../models/userModel');
const AppError = require('./appError');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('You are not logged in! Please login for get access', 401)
    );

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECERT_KEY
  );
  const user = await User.findByPk(decoded.id);
  if (!user)
    return next(
      new AppError('The token beloning to this user does not exists', 401)
    );

  const pwChangedTimestamp = parseInt(
    user.passwordChangedAt.getTime() / 1000,
    10
  );

  if (pwChangedTimestamp > decoded.iat)
    return next(
      new AppError('User changed his password! please login again', 401)
    );

  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.generateJWT = (user, res) => {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECERT_KEY,
    { expiresIn: '90d' }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
  });

  return token;
};

exports.isVaildUserToken = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: new Date() },
    },
  });

  return user;
});
