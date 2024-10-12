
const Sequelize = require("sequelize");
const sequelize = require('./database'); // Conexiunea la baza de date

const tModels = require("./type.models.js")(sequelize, Sequelize);

module.exports = (sequelize, Sequelize) => {
    const OmsIndexMeasurements = sequelize.define('omsindex_measurements', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        ageId: { type: Sequelize.INTEGER, references: { model: 'type_age', key: 'id' }, allowNull: false },
        residenceId: { type: Sequelize.INTEGER, references: { model: 'type_residence', key: 'id' }, allowNull: false },
        measurementId: { type: Sequelize.INTEGER, references: { model: 'type_measurement', key: 'id' }, allowNull: false },
        genderId: { type: Sequelize.INTEGER, references: { model: 'type_gender', key: 'id' }, allowNull: false },
        media: { type: Sequelize.FLOAT, allowNull: false },
        dev_std: { type: Sequelize.FLOAT, allowNull: false },
        m_minus_3d: { type: Sequelize.FLOAT, allowNull: false },
        m_minus_2d: { type: Sequelize.FLOAT, allowNull: false },
        m_minus_1d: { type: Sequelize.FLOAT, allowNull: false },
        m_plus_1d: { type: Sequelize.FLOAT, allowNull: false },
        m_plus_2d: { type: Sequelize.FLOAT, allowNull: false },
        m_plus_3d: { type: Sequelize.FLOAT, allowNull: false }
    }, {
        tableName: 'omsindex_measurements',
        timestamps: false
    });


    tModels.TypeAge.hasMany(OmsIndexMeasurements, { foreignKey: 'ageId' });
    OmsIndexMeasurements.belongsTo(tModels.TypeAge, { foreignKey: 'ageId' });

    tModels.TypeGender.hasMany(OmsIndexMeasurements, { foreignKey: 'genderId' });
    OmsIndexMeasurements.belongsTo(tModels.TypeGender, { foreignKey: 'genderId' });

    tModels.TypeMeasurement.hasMany(OmsIndexMeasurements, { foreignKey: 'measurementId' });
    OmsIndexMeasurements.belongsTo(tModels.TypeMeasurement, { foreignKey: 'measurementId' });

    tModels.TypeResidence.hasMany(OmsIndexMeasurements, { foreignKey: 'residenceId' });
    OmsIndexMeasurements.belongsTo(tModels.TypeResidence, { foreignKey: 'residenceId' });


    return OmsIndexMeasurements;
};

