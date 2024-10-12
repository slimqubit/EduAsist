// models/user.model.js

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: false }
  });

  return User;
};