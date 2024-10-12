// models/school.models.js

const Sequelize = require("sequelize");
const sequelize = require('./database.js'); // Conexiunea la baza de date

const tModels = require("./type.models.js")(sequelize, Sequelize);
const User = require("./user.model.js")(sequelize, Sequelize);

module.exports = (sequelize, Sequelize) => {

    const School = sequelize.define("school", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        city: { type: Sequelize.STRING, allowNull: false },
        county: { type: Sequelize.STRING, allowNull: false },
        address: { type: Sequelize.STRING, allowNull: false },
        residenceId: { type: Sequelize.INTEGER, references: { model: 'type_residence', key: 'id' }, allowNull: false },
        userId: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },
    });

    User.hasMany(School, { foreignKey: 'userId', onDelete: 'CASCADE' });
    School.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    School.belongsTo(tModels.TypeResidence, { foreignKey: 'residenceId' });
    tModels.TypeResidence.hasMany(School, { foreignKey: 'residenceId' });


    const Class = sequelize.define("class", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        grade: { type: Sequelize.INTEGER, allowNull: false },
        letter: { type: Sequelize.STRING, allowNull: true },
        class_master: { type: Sequelize.STRING, allowNull: true },
        promotion: { type: Sequelize.STRING, allowNull: true },
        schoolId: { type: Sequelize.INTEGER, references: { model: 'schools', key: 'id' }, allowNull: false },

        name: {
            type: Sequelize.VIRTUAL,
            get() {
                const romanGrade = arabicToRoman(this.grade); // Convert grade to Roman numeral
                if (this.letter !== null)
                    return `Clasa a ${romanGrade}-a ${this.letter}`;
                else
                    return `Clasa a ${romanGrade}-a`;
            }
        }
    });

    Class.belongsTo(School, { foreignKey: 'schoolId', onDelete: 'CASCADE' });
    School.hasMany(Class, { foreignKey: 'schoolId', onDelete: 'CASCADE' });


    const Student = sequelize.define("student", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        firstName: { type: Sequelize.STRING, allowNull: false },
        lastName: { type: Sequelize.STRING, allowNull: false },
        cnp: { type: Sequelize.STRING, allowNull: false, unique: true },
        dateOfBirth: { type: Sequelize.DATEONLY, allowNull: false },
        genderId: { type: Sequelize.INTEGER, references: { model: 'type_gender', key: 'id' }, allowNull: false },
        address: { type: Sequelize.STRING, allowNull: false },
        schoolId: { type: Sequelize.INTEGER, references: { model: 'schools', key: 'id' }, allowNull: false },
        classId: { type: Sequelize.INTEGER, references: { model: 'classes', key: 'id' }, allowNull: false },
    });

    Student.belongsTo(School, { foreignKey: 'schoolId', onDelete: 'CASCADE' });
    School.hasMany(Student, { foreignKey: 'schoolId', onDelete: 'CASCADE' });
    Student.belongsTo(Class, { foreignKey: 'classId', onDelete: 'CASCADE' });
    Class.hasMany(Student, { foreignKey: 'classId', onDelete: 'CASCADE' });
    Student.belongsTo(tModels.TypeGender, { foreignKey: 'genderId' });
    tModels.TypeGender.hasMany(Student, { foreignKey: 'genderId' });

    return { School, Class, Student };
};



// Utility function to convert Arabic numerals to Roman numerals
function arabicToRoman(num) {
    const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    for (let i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}