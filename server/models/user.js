'use strict';

const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize
  const Model = Sequelize.Model

  class User extends Model {}

  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name must be filled"
        },
        notNull: {
          args: true,
          msg: "Please enter your name"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Email must be filled"
        },
        isEmail: {
          args: true,
          msg: "Email wrong format"
        },
        notNull: {
          args: true,
          msg: "Please enter your email"
        }
      }
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Role must be filled"
        }
      }
    }
  },
  {
    hooks: {
      beforeCreate: (user, option) => {
        user.password = bcrypt.hashSync(user.password, 10)
      },
      beforeUpdate: (user, option) => {
        user.password = bcrypt.hashSync(user.password, 10)
      }
    },
    sequelize
  })

  User.associate = function(models) {
    User.hasMany(models.Cart)
    User.belongsToMany(models.Product, { through : models.Cart })
  };

  return User;
};