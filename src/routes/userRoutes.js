const {
  getAllUsers,
  createOneUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
} = require('../controllers/userController');

const router = require('express').Router();

router.route('/').get(getAllUsers).post(createOneUser);
router.route('/:id').get(getOneUser).patch(updateOneUser).delete(deleteOneUser);

module.exports = router;
