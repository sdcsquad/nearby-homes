const Sequelize = require('sequelize');

const db = new Sequelize('neighborhood', 'alexsheehan', '', {
  dialect: 'postgres',
  operatorsAliases: false,
  define: {
    timestamps: false,
  },
});

module.exports = db;
