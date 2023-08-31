const {body, validationResult} = require('express-validator');

module.exports = (req,res, nxt)=>{
    const emailChain = body('email').isEmail().notEmpty().trim();
    console.log(emailChain);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error(errors);
      return res.status(404).json({ status: 'fail', errors: errors.array() });
    }
    nxt()
};