// controllers/student.controller.js
const db = require("../models");
const SomatometricMeasurement = db.somatometricmeasurement;
const Student = db.student;
const TypeGender = db.type_gender;
const Sequelize = require("sequelize");
const sequelize = require('../models/database'); // Conexiunea la baza de date



//const studentValidationSchema = require("../validation/student.validation");

exports.create = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        if (!studentId) return res.status(400).send({ message: "Student ID is required" });


        const measurementExists = await SomatometricMeasurement.findOne({ where: { studentId: req.body.studentId, measurementDate: req.body.measurementDate } });
        if (measurementExists) return res.status(400).send({ message: `O masurătoare din data: ${req.body.measurementDate}, pentru acest elev, deja există.` });


        //const { error } = studentValidationSchema.validate(req.body);
        //if (error) return res.status(400).send({ message: "Validation failed. " + error.details[0].message });

        const somatomm = await SomatometricMeasurement.create(req.body);
        res.status(201).send(somatomm);
    } catch (err) {
        res.status(500).send({ message: err.message || "A apărut o eroare la salvarea datelor." });
    }
};


exports.findAll = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        if (!studentId) return res.status(400).send({ message: "Student ID is required" });

        const grade = req.params.grade;


        const somatomm = await SomatometricMeasurement.findAll({ where: { studentId: studentId } });
        if (!somatomm) return res.status(404).send({ message: "Measurement not found." });
        res.status(200).send(somatomm);
    } catch (err) {
        res.status(500).send({ message: err.message || `Error retrieving class with id=${classId}` });
    }
};


exports.findOne = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        if (!studentId) return res.status(400).send({ message: "Student ID is required" });

        const somatommId = req.params.somatommId;
        const somatomm = await SomatometricMeasurement.findByPk(somatommId);
        if (!somatomm) return res.status(404).send({ message: "Measurement not found." });
        res.status(200).send(somatomm);
    } catch (err) {
        res.status(500).send({ message: err.message || `Error retrieving class with id=${classId}` });
    }
};


exports.update = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        if (!studentId) return res.status(400).send({ message: "Student ID is required" });

        const somatommId = req.params.somatommId;
        const [updated] = await SomatometricMeasurement.update(req.body, { where: { id: somatommId } });
        if (updated) {
            const updatedSomatomm = await SomatometricMeasurement.findByPk(somatommId);
            res.status(200).send(updatedSomatomm);
        } else {
            res.status(404).send({ message: `Eroare la actualizarea măsurătorii cu id=${somatommId}!` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || `Eroare la actualizarea măsurătorii cu id=${somatommId}` });
    }
};

exports.delete = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        if (!studentId) return res.status(400).send({ message: "Student ID is required" });

        const somatommId = req.params.somatommId;
        const deleted = await SomatometricMeasurement.destroy({
            where: { id: somatommId }
        });
        if (deleted) {
            res.status(200).send({ message: "Măsurătoarea a fost ștersă cu success!" });
        } else {
            res.status(404).send({ message: `Eroare la stergerea măsurătorii cu id=${somatommId}.` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || `Eroare la stergerea elevului cu id=${somatommId}` });
    }
};


// Returnează un raport al măsurătorilor în functie de indicatorul "grade" astfel
// grade from (0 .. 13): pentru elevi din 
// grade === 101: pentru elevi din înv. primar
// grade === 102: pentru elevi din înv. gimnazial
// grade === 103: pentru elevi din înv. liceal
// grade === 104: pentru elevi din înv. liceal + p
// grade === 111: pentru elevii din toată școala


exports.reportByGrade = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });
        const grade = req.params.grade;
        if (!grade) return res.status(400).send({ message: "Grade is required" });

        let whereStatement = `WHERE S.schoolId = ${schoolId}`;
    
        switch (grade) {
            case '101':
                whereStatement = `${whereStatement} AND C.grade BETWEEN 0 and 4`;
                break;
            case '102':
                whereStatement = `${whereStatement} AND C.grade BETWEEN 5 and 8`;
                break;
            case '103':
                whereStatement = `${whereStatement} AND C.grade BETWEEN 9 and 12`;
                break;
            case '104':
                whereStatement = `${whereStatement} AND C.grade BETWEEN 9 and 13`;
                break;
            case '111':
                whereStatement = `${whereStatement}`;
                break;
            default:
                whereStatement = `${whereStatement} AND C.grade = ${grade}`;
                break;
        }

        const [results, metadata] = await sequelize.query(
            `SELECT 
	            S.id, S.firstName, S.lastName, S.cnp, S.dateOfBirth, TG.gender, TR.residence, C.grade,
                SM.measurementDate, SM.omsAge, SM.height, SM.weight, SM.resImc, SM.resHeight, SM.resWeight
            FROM Students S
	            JOIN Type_Residence TR on S.residenceId = TR.id
	            JOIN Type_Gender TG on S.genderId = TG.id
	            JOIN Classes C on S.classId = C.id
	            LEFT JOIN SomatometricMeasurements SM on S.id = SM.studentId
            ${whereStatement};`,
        );


        if (!results) return res.status(404).send({ message: "Measurement not found." });
        res.status(200).send(results);

    } catch (err) {
        res.status(500).send({ message: err.message || `Error retrieving class with id=${classId}` });
    }
};