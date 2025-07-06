const { DataTypes } = require('sequelize');
const sequelize = require('./index');


const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false 
  }
}, {
  tableName: 'categories',
  timestamps: true
});


module.exports = Category;