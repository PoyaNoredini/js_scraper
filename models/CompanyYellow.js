const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index');
const Category = require('./Category');

const CompanyYellow = sequelize.define('CompanyYellow', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    link_web: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    link_yellow_page: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instagram_link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    facebook_link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkedin_link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    whatsapp_link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    twitter_link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    business_hours: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, {
    tableName: 'company_yellows',
    timestamps: true
});

// Define the association
CompanyYellow.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

module.exports = CompanyYellow;