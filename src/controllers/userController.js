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
// All This controller below for test only .
exports.createOneUser = createOne(User);
exports.deleteOneUser = deleteOne(User);
exports.updateOneUser = updateOne(User);
