const { EmptyResultError } = require('sequelize');
const AppError = require('../helpers/appError');

function handleDupError(err, res) {
  const message = err.errors[0].message;
  return new AppError(message, 400);
}

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  // Operational Errors are errors which our server (we created) sent it
  if ((err.isOperational = true)) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Other unknown errors
  else {
    console.error('Error 💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') sendErrorProd(err, res);
  else {
    // Its not best practice to set fn argument to another fn.
    let error = { ...err };
    if (err.name === 'SequelizeUniqueConstraintError')
      err = handleDupError(err, res);

    sendErrorDev(err, res);
  }
};
