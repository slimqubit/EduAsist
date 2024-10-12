// controllers/school.controller.js
const db = require("../models");
const School = db.school;
const schoolValidationSchema = require("../validation/school.validation");

exports.create = async (req, res) => {
    try {
        req.body.userId = req.userId;
        const { error } = schoolValidationSchema.validate(req.body);
        if (error) return res.status(400).send({ message: "Validation failed. " + error.details[0].message });

        const school = await School.create(req.body);
        res.status(201).send(school);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error occurred while creating the school." });
    }
};

exports.findAll = async (req, res) => {
    try {
        const schools = await School.findAll({ where: { userId: req.userId } });
        res.status(200).send(schools);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving schools." });
    }
};


exports.findOne = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        const school = await School.findByPk(schoolId);
        if (!school) return res.status(404).send({ message: "School not found." });
        res.status(200).send(school);
    } catch (err) {
        res.status(500).send({ message: err.message || `Error retrieving school with id=${schoolId}` });
    }
};


exports.update = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        const [updated] = await School.update(req.body, { where: { id: schoolId, userId: req.userId } });
        if (updated) {
            const updatedSchool = await School.findByPk(schoolId);
            res.status(200).send(updatedSchool);
        } else {
            res.status(404).send({ message: `Cannot update school with id=${schoolId}. Maybe school was not found or req.body is empty!` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || `Error updating school with id=${schoolId}` });
    }
};

exports.delete = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        const deleted = await School.destroy({ where: { id: schoolId, userId: req.userId } });
        if (deleted) {
            res.status(200).send({ message: "School was deleted successfully!" });
        } else {
            res.status(404).send({ message: `Cannot delete school with id=${schoolId}. Maybe school was not found!` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || `Could not delete school with id=${schoolId}` });
    }
};

