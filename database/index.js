require('dotenv');
const Sequelize = require('sequelize');

const db = new Sequelize('neighborhood', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  dialect: 'postgres',
  operatorsAliases: false,
  define: {
    timestamps: false,
  },
});

module.exports = db;
