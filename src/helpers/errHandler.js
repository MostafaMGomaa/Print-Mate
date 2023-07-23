const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (optional)
  console.error(err);

  // Set the status code for the response (500 for internal server error)
  res.status(500);

  // Send the error as a JSON response
  res.json({ error: err.message });
};

module.exports = errorHandler;
