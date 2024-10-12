// controllers/student.controller.js
const db = require("../models");
const Student = db.student;
const Class = db.class;
const TypeGender = db.type_gender;

const studentValidationSchema = require("../validation/student.validation");

exports.create = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "ID-ul școlii este necesar" });

        const cnpExists = await Student.findOne({ where: { cnp: req.body.cnp } });
        if (cnpExists) return res.status(400).send({ message: `Elevul cu CNP-ul: ${req.body.cnp} deja există.` });

        const { error } = studentValidationSchema.validate(req.body);
        if (error) return res.status(400).send({ message: "Validarea a eșuat. " + error.details[0].message });

        const student = await Student.create(req.body);
        res.status(201).send(student);
    } catch (err) {
        res.status(500).send({ message: err.message || "A apărut o eroare la salvarea datelor." });
    }
};

exports.findAllinClass = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "ID-ul școlii este necesar" });
        const classId = req.params.classId;
        if (!classId) return res.status(400).send({ message: "ID-ul clasei este necesar" });

        const students = await Student.findAll({
            where: { classId: classId },
            order: [['lastName', 'ASC'], ['firstName', 'ASC']]
        });
        res.status(200).send(students);
    } catch (err) {
        res.status(500).send({ message: err.message || "A apărut o eroare la generarea listei cu elevi." });
    }
};

exports.findAllinSchool = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ where: { schoolId: schoolId } });

        const students = await Student.findAll({
            include: [{
                model: Class,
                where: { schoolId: schoolId },
                attributes: ['id', 'grade', 'name', 'class_master'],
                required: true
            }],
            order: [['lastName', 'ASC'], ['firstName', 'ASC']]
        });

        res.status(200).send(students);
    } catch (err) {
        res.status(500).send({ message: err.message || "A apărut o eroare la generarea listei cu elevi." });
    }
};

exports.findOne = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "ID-ul școlii este necesar" });

        const studentId = req.params.studentId;
        //const student = await Student.findByPk(studentId);

        const student = await Student.findOne({
            where: { id: studentId },
            include: [
                { model: Class, as: 'class', attributes: ['id', 'grade', 'letter','name', 'class_master'] },
                { model: TypeGender, as: 'type_gender', attributes: ['gender'] }           
            ]
        });

        if (!student) return res.status(404).send({ message: "Elevul nu a fost găsit în baza de date." });
        res.status(200).send(student);
    } catch (err) {
        res.status(500).send({ message: err.message || `Eroare la obținerea informațiilor pentru elevul cu id=${id}.` });
    }
};

exports.update = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "ID-ul școlii este necesar" });

        const studentId = req.params.studentId;
        const [updated] = await Student.update(req.body, { where: { id: studentId } });
        if (updated) {
            const updatedStudent = await Student.findByPk(studentId);
            res.status(200).send(updatedStudent);
        } else {
            res.status(404).send({ message: `Eroare la actualizarea datelor elevului cu id=${studentId}!` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || `Eroare la actualizarea datelor elevului cu id=${studentId}` });
    }
};

exports.delete = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "ID-ul școlii este necesar" });

        const studentId = req.params.studentId;
        const deleted = await Student.destroy({
            where: { id: studentId }
        });
        if (deleted) {
            res.status(200).send({ message: "Elevul a fost șters cu succes!" });
        } else {
            res.status(404).send({ message: `Eroare la ștergerea elevului cu id=${studentId}.` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || `Eroare la ștergerea elevului cu id=${studentId}` });
    }
};
