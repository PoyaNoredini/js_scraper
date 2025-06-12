const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SubCategory extends Model {}

SubCategory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'SubCategory',
  tableName: 'sub_categories',
  timestamps: true
});
// Add these associations
SubCategory.belongsTo(require('./Category'), {
    foreignKey: 'categoryId',
    as: 'category'
});

SubCategory.hasMany(require('./CompanyYellow'), {
    foreignKey: 'sub_category_id',
    as: 'companies'
});
module.exports = SubCategory;