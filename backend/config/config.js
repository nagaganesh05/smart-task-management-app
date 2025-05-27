// backend/config/config.js
// This file is used by Sequelize CLI for migrations and by models/index.js
require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "logging": false // Set to true to see SQL queries in console
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME + "_test",
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME + "_prod",
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "logging": false
  }
};