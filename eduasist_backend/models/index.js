


const Sequelize = require("sequelize");
const sequelize = require('./database'); // Conexiunea la baza de date

const medicine_models = require("./stock.models.js")(sequelize, Sequelize);
const type_models = require("./type.models.js")(sequelize, Sequelize);
const school_models = require("./school.models.js")(sequelize, Sequelize);

const db = {};

db.student = school_models.Student;
db.class = school_models.Class;
db.school = school_models.School;

db.product = medicine_models.Product;
db.stock_movement = medicine_models.StockMovement;
db.stock_snapshot = medicine_models.StockSnapshot;

db.type_age = type_models.TypeAge
db.type_gender = type_models.TypeGender
db.type_measurement = type_models.TypeMeasurement
db.type_residence = type_models.TypeResidence
db.type_unit = type_models.TypeUnit

db.Sequelize = Sequelize;
db.sequelize = sequelize;




db.user = require("./user.model.js")(sequelize, Sequelize);

db.omsindex_measurements = require("./omsindex_measurements.model.js")(sequelize, Sequelize);
db.somatometricmeasurement = require("./somatomm.model.js")(sequelize, Sequelize);


// Load associations
//db.omsindex_measurements.associate({ db.type_age });
//db.type_age.associate({ db.omsindex_measurements });











db.sequelize.sync(); // This syncs your models with the database

module.exports = db;
