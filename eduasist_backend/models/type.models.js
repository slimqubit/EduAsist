

module.exports = (sequelize, Sequelize) => {

    const TypeAge = sequelize.define('type_age', {
        id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
        months: { type: Sequelize.INTEGER, allowNull: false },
        years: { type: Sequelize.INTEGER, allowNull: false },
        description: { type: Sequelize.STRING, allowNull: false, unique: true }
    }, {
        tableName: 'type_age',
        timestamps: false
    });


    const TypeResidence = sequelize.define('type_residence', {
        id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
        residence: { type: Sequelize.STRING, allowNull: false, unique: true }
    }, {
        tableName: 'type_residence',
        timestamps: false
    });


    const TypeMeasurement = sequelize.define('type_measurement', {
        id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
        measurement: { type: Sequelize.STRING, allowNull: false, unique: true }
    }, {
        tableName: 'type_measurement',
        timestamps: false
    });


    const TypeGender = sequelize.define('type_gender', {
        id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
        gender: { type: Sequelize.STRING, allowNull: false, unique: true },
        gender_pl: { type: Sequelize.STRING, allowNull: false, unique: true }
    }, {
        tableName: 'type_gender',
        timestamps: false
    });


    const TypeUnit = sequelize.define('type_unit', {
        id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
        unit: { type: Sequelize.STRING, allowNull: false, unique: true },
    }, {
        tableName: 'type_unit',
        timestamps: false
    });


    
    return { TypeAge, TypeResidence, TypeMeasurement, TypeGender, TypeUnit };
};