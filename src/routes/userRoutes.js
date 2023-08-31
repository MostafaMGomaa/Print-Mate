const router = require('express').Router();
const {verifyToken, isAdminToken} = require('../helpers/tokenHandler');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  updateOneUser,
  getOneUser,
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

router.route('/:id', verifyToken).get(getOneUser).patch(updateOneUser);

// @dec admin operations
router.get('/',       isAdminToken, getAllUsers);
router.delete('/:id', isAdminToken, deleteOneUser);
module.exports = router;
