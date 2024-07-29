const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', 'Parkavi@19', {
  host: 'localhost',
  dialect: 'postgres'
});
  const Item = sequelize.define(
    "items",
    {
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      cgst: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      sgst: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      tableName: "items",
      timestamps: false,
    },
  );

  module.exports = Item;
