const { Sequelize } = require('sequelize');
const Item = require('./Item');

const sequelize = new Sequelize('postgres', 'postgres', 'Parkavi@19', {
    host: 'localhost',
    dialect: 'postgres'
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
  sequelize,
  Item
};
