const router = require('express').Router();
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser
} = require('../controllers/userController');

//Authentication 
router.post('/signup', signup);
router.post('/login',  login);
router.post('/forgot-password', forgotPassword);
router.route('/reset-password/:id/:token')
      .post(resetPassword)
    //.get();
router.get('/logout', logout);

router.route('/:id').get(getOneUser).patch(updateOneUser);

// @dec admin operations
router.get('/', getAllUsers);
router.delete('/:id',deleteOneUser);
module.exports = router;
