// controllers/student.controller.js
const db = require("../models");
const SomatometricMeasurement = db.somatometricmeasurement;


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

