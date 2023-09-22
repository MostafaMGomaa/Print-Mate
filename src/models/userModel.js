const { DataTypes } = require('sequelize');
const DB = require('../db');
const bcrypt = require('bcryptjs');
const AppError = require('../helpers/appError');

const db = new DB().getRepository();
const User = db.define(
  'user',
  {
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Name is required.' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Email is required.' },
        isEmail: { msg: 'Invalid email format.' },
      },
    },
    photo: { type: DataTypes.STRING, defaultValue: 'photo.jpg' },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user'],
      defaultValue: 'user',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [8], msg: 'Password must be at least 8 characters long.' },
      },
    },
    passwordConfirm: DataTypes.STRING,
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
  },
  {
    timestamps: false,
  }
);

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    if (user.password !== user.passwordConfirm)
      throw new AppError('Passwords do not match', 400);

    user.password = await bcrypt.hash(user.password, 12);
    user.passwordConfirm = undefined;
  }
  user.name = user.name.trim().toLowerCase();
});

module.exports = User;
