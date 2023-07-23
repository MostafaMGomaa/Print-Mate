const User = require('../models/userModel');
const {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} = require('./hanleOps');

exports.getAllUsers = getAll(User);
exports.getOneUser = getOne(User);
exports.createOneUser = createOne(User);
exports.deleteOneUser = deleteOne(User);
exports.updateOneUser = updateOne(User);
