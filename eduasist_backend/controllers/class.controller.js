// controllers/class.controller.js
const db = require("../models");
const Class = db.class;
const classValidationSchema = require("../validation/class.validation");

exports.create = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        const { error } = classValidationSchema.validate(req.body);
        if (error) return res.status(400).send({ message: "Validation failed. " + error.details[0].message });

        const cclass = await Class.create(req.body);
        res.status(201).send(cclass);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error occurred while creating the class." });
    }
};

exports.findAll = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        const classes = await Class.findAll({ where: { schoolId: schoolId } });
        res.status(200).send(classes);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving classes." });
    }
};


exports.findOne = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        const classId = req.params.classId;
        const cclass = await Class.findByPk(classId);
        if (!cclass) return res.status(404).send({ message: "Class not found." });
        res.status(200).send(cclass);
    } catch (err) {
        res.status(500).send({ message: err.message || `Error retrieving class with id=${classId}` });
    }
};


exports.update = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        const classId = req.params.classId;
        const [updated] = await Class.update(req.body, { where: { id: classId } });
        if (updated) {
            const updatedClass = await Class.findByPk(classId);
            res.status(200).send(updatedClass);
        } else {
            res.status(404).send({ message: `Cannot update class with id=${classId}. Maybe class was not found or req.body is empty!` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || `Error updating class with id=${id}` });
    }
};

exports.delete = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        const classId = req.params.classId;
        const deleted = await Class.destroy({ where: { id: classId } });
        if (deleted) {
            res.status(200).send({ message: "Class was deleted successfully!" });
        } else {
            res.status(404).send({ message: `Cannot delete class with id=${classId}. Maybe class was not found!` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || `Could not delete class with id=${classId}` });
    }
};

