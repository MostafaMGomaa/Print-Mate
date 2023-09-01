const { validationResult } = require('express-validator');

exports.handleInputError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(errors);
    return res.status(400).json({
      status: 'fail',
      errors: errors.array(),
    });
  }
  next();
};

exports.isUnEmail = (email) => {
  const universityDomain = 'alex.edu.eg';
  const emailDomain = email.split('@')[1];
  return universityDomain.includes(emailDomain);
};
