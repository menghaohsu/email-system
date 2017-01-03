'use strict';

const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('dessert', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      max: 12,
      min: 1
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      max: 2030,
      min: 2016
    }
  }
});
