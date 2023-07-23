const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(express.json());

// errorHandler.js
const errorHandler = (error, req, res, next) => {
  // Log the error for debugging (optional)
  console.error(error);

  // Set the status code for the response (500 for internal server error)
  res.status(500);

  // Send the error as a JSON response
  res.json({ error });
};

if (process.env.NODE_ENV === 'prod') app.use(morgan);

app.use('/api/v1/users', userRoutes);
app.use(errorHandler);
module.exports = app;
