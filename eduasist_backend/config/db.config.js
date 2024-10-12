module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};


// CREATE DATABASE AppDB;
// CREATE USER 'user'@'localhost' IDENTIFIED BY 'pass';
// GRANT ALL PRIVILEGES ON AppDB.* TO 'user'@'localhost' WITH GRANT OPTION;