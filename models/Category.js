const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const CompanyYellow = require('./CompanyYellow');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'categories',
  timestamps: true
});

// Correct relation
Category.hasMany(CompanyYellow, {
  foreignKey: 'category_id',
  as: 'company_yellows'
});

module.exports = Category;