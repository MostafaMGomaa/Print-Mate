const router = require('express').Router();
const { body } = require('express-validator');

const { protect, restrictTo } = require('../helpers/auth');
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
  verifyToken,
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
router.patch('/reset-password/:resetToken', resetPassword);
router.get('/verify-token/:resetToken', verifyToken);
router.get('/logout', logout);

router.use(protect);
router.route('/:id').get(getOneUser).patch(updateOneUser);
router.get('/', getAllUsers);

router.use(restrictTo('admin'));
router.delete('/:id', deleteOneUser);

module.exports = router;
