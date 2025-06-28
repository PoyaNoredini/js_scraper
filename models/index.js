require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,       // "web_Scraper"
  process.env.DB_USERNAME,   // "ubuntu"
  process.env.DB_PASSWORD,   // "Ubuntu@1234!"
  {
    host: process.env.DB_HOST,  // "localhost"
    dialect: 'mysql',
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
