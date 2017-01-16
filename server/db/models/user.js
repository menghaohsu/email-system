const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('user', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    isEmail: true
  },
  sentMonth: {
    type: DataTypes.INTEGER,
    validate: {
      max: 12,
      min: 1
    }
  },
  sentYear: {
    type: DataTypes.INTEGER,
    validate: {
      max: 2030,
      min: 2016
    }
  },
  code1: {
    type: DataTypes.STRING
  },
  code2: {
    type: DataTypes.STRING
  },
  code3: {
    type: DataTypes.STRING
  },
  code4: {
    type: DataTypes.STRING
  },
  code5: {
    type: DataTypes.STRING
  },
  confirmationCode1: {
    type: DataTypes.STRING
  },
  confirmationCode2: {
    type: DataTypes.STRING
  },
  confirmationCode3: {
    type: DataTypes.STRING
  },
  confirmationCode4: {
    type: DataTypes.STRING
  },
  confirmationCode5: {
    type: DataTypes.STRING
  },
  redeemDate: {
    type: DataTypes.DATE
  },
  sentDate: {
    type: DataTypes.DATE
  }
});
