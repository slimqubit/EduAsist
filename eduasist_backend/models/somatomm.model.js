// models/somatometricmeasurement.model.js

const Sequelize = require("sequelize");
const sequelize = require('./database'); // Conexiunea la baza de date

const school_models = require("./school.models.js")(sequelize, Sequelize);
const Student = school_models.Student;


module.exports = (sequelize, Sequelize) => {
    const SomatometricMeasurement = sequelize.define('SomatometricMeasurement', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        measurementDate: { type: Sequelize.DATEONLY, allowNull: false },
        height: { type: Sequelize.FLOAT, allowNull: false },
        weight: { type: Sequelize.FLOAT, allowNull: false },
        chestCircumference: { type: Sequelize.FLOAT, allowNull: false },
        headCircumference: { type: Sequelize.FLOAT, allowNull: false },
        studentId: { type: Sequelize.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
        omsAge: { type: Sequelize.FLOAT, allowNull: false },
        ageMonths: { type: Sequelize.INTEGER, allowNull: false },
        resImc: { type: Sequelize.FLOAT, allowNull: true },
        resHeight: { type: Sequelize.FLOAT, allowNull: true },
        resWeight: { type: Sequelize.FLOAT, allowNull: true },
        resCCest: { type: Sequelize.FLOAT, allowNull: true },
        resCHead: { type: Sequelize.FLOAT, allowNull: true },

    });
 
    Student.hasMany(SomatometricMeasurement, {foreignKey: 'studentId', onDelete: 'CASCADE'});
    SomatometricMeasurement.belongsTo(Student, { foreignKey: 'studentId', onDelete: 'CASCADE' });
    

    return SomatometricMeasurement;
};