const asyncHandler = require('express-async-handler');

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.findAll();

    res.status(200).json({
      status: 'success',
      result: data.length,
      data,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data,
    });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.findByPk(req.params.id);

    if (!data)
      return res
        .status(404)
        .json({ status: 'error', message: 'cannot find user with that id' });

    res.status(200).json({ status: 'success', data });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const [updatedRowCount, updatedRows] = await Model.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });

    if (updatedRowCount === 0)
      return res
        .status(404)
        .json({ status: 'error', message: 'cannot find user with that id' });

    res
      .status(200)
      .json({ message: 'User updated successfully', data: updatedRows[0] });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const data = await Model.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (data === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).json({ message: 'User deleted successfully' });
  });
