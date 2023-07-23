const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
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
      validate: { len: [8, 50] },
    },
    passwordConfirm: { type: DataTypes.STRING, allowNull: false },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.DATE,
    passwordResetExpires: DataTypes.STRING,
  },
  {
    timestamps: false,
  }
);

User.beforeSave(function (user) {
  if (user.changed('password')) {
    if (user.password !== user.passwordConfirm)
      throw new Error('Passwords do not match');
  }
});

User.beforeSave((user) => {
  user.name = user.name.trim().toLowerCase();
});

module.exports = User;
