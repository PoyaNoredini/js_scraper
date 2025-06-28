const Category = require('./Category');
const CompanyYellow = require('./CompanyYellow');

Category.hasMany(CompanyYellow, {
  foreignKey: 'category_id',
  as: 'company_yellows'
});

CompanyYellow.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});
