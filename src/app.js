const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./helpers/appError');

const app = express();

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
  return next(new AppError(`Cannot find ${req.originalUrl} in server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
