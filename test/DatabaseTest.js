require('dotenv').config({ path: '../.env' });
const { Sequelize } = require('sequelize');
const config = require('../config/databaseConfig.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

console.log('Database Config:', {
    database: dbConfig.database,
    username: dbConfig.username,
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful');
    } catch (error) {
        console.error('Unable to connect to database:', error);
    } finally {
        await sequelize.close();
    }
}

testConnection();