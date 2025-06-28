'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('company_yellows', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      link_web: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      link_yellow_page: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      instagram_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      facebook_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      linkedin_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      whatsapp_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      twitter_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      business_hours: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city:{
        type: Sequelize.STRING,
        allowNull: true
      },
      category_id:{
        type:Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      sub_category: {
        type: Sequelize.STRING,
        allowNull: true,
  
          },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('company_yellows');
  }
};