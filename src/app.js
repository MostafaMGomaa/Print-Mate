const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./helpers/appError');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'prod') app.use(morgan);

app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
  return next(new AppError(`Cannot find ${req.originalUrl} in server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
