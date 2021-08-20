const Sequelize = require('sequelize');
require("dotenv").config()

const isProduction = process.env.NODE_ENV === 'production';

module.exports =  new Sequelize(!isProduction ? process.env.DATABASE_NAME : "null",!isProduction ? process.env.DB_USER : "null",!isProduction ? process.env.DB_PASSWORD: "null", {
    host: 'localhost',
    dialect: 'mysql',
    port: '3307', /* Change port accordingly */
    pool:{
        max: 5, 
        min: 0,
        idle: 10000                
      }
  });
