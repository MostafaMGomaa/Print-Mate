const router = require('express').Router();
const { body } = require('express-validator');

const { verifyToken, isAdminToken } = require('../helpers/tokenHandler');
const { handleInputError } = require('../helpers/middlewares');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  updateOneUser,
  getOneUser,
  deleteOneUser,
} = require('../controllers/userController');

//Authentication
router.post(
  '/signup',
  body('name').isString().withMessage('Please provide name'),
  body('email').isEmail().withMessage('Please enter vaild email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password length must be at least 8 chars'),
  handleInputError,
  signup
);
router.post(
  '/login',
  body('email').isEmail().withMessage('Please enter vaild email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password length must be at least 8 chars'),
  handleInputError,
  login
);
router.post('/forgot-password', forgotPassword);
router.route('/reset-password/:id/:token').post(resetPassword);

router.get('/logout', logout);

router.route('/:id').get(getOneUser).patch(updateOneUser);

// @dec admin operations
router.get('/', isAdminToken, getAllUsers);
router.delete('/:id', isAdminToken, deleteOneUser);
module.exports = router;
