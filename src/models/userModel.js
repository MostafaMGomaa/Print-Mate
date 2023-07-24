const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcryptjs');
const AppError = require('../helpers/appError');

const User = sequelize.define(
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
    passwordResetToken: DataTypes.DATE,
    passwordResetExpires: DataTypes.STRING,
  },
  {
    timestamps: false,
  }
);

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    // Validate password , passwordConfirm
    if (user.password !== user.passwordConfirm)
      return new AppError('Passwords do not match', 400);

    // Hash the password and set passwordConfirm undefined
    user.password = await bcrypt.hash(user.password, 12);
    user.passwordConfirm = undefined;
  }
});

// To trim username and convert it to lowercase
User.beforeSave((user) => {
  user.name = user.name.trim().toLowerCase();
});

module.exports = User;
