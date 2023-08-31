const jwt = require('jsonwebtoken');
const AppError = require('./appError');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

exports.generateToken = (user, res) => {
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.SECKEY,
    { expiresIn: '7d' }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
  });

  return token;
};

exports.verifyToken = asyncHandler(async(req,res,next)=>{
  const token = req.cookies.jwt;
  if(!token) 
    return next(new AppError('You are not logged in! Please login for get access', 403));

  const decoded = await jwt.verify(token, process.env.SECKEY);
  const user    = await User.findByPk(decoded?.userId);
  req.user = user;
  next();
});

exports.isAdminToken =  asyncHandler(async(req,res,next)=>{
  const token = await req.cookies.jwt;
  if(!token) 
    return next(new AppError('You are not logged in! Please login for get access', 401));

  const decoded = await jwt.verify(token, process.env.SECKEY);
  const user    = await User.findByPk(decoded?.userId);
  if(decoded.role != 'admin')
    return next(new AppError('Unauthorized access!', 401));
     
  req.user = user;
  next();
});