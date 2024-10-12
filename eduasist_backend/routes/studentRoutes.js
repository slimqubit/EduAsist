// routes/student.routes.js



module.exports = (app) => {
    const students = require("../controllers/student.controller.js");
    const verifyToken = require("../middleware/auth.middleware.js");

    const router = require("express").Router();

    // Creare elev nou
    router.post("/schools/:schoolId/students", verifyToken, students.create);

    // Returnează toți elevii dintr-o clasă
    router.get("/schools/:schoolId/students/inclass/:classId", verifyToken, students.findAllinClass);

    // Returnează toți elevii dintr-o școală
    router.get("/schools/:schoolId/students/inschool", verifyToken, students.findAllinSchool);

    // Returnează un singur elev după ID
    router.get("/schools/:schoolId/students/:studentId", verifyToken, students.findOne);

    // Actualizează un elev după ID
    router.put("/schools/:schoolId/students/:studentId", verifyToken, students.update);

    // Șterge un elev după ID
    router.delete("/schools/:schoolId/students/:studentId", verifyToken, students.delete);

    // module.exports = router;

    app.use("/api", router);
};

/*

const express = require('express');
const router = express.Router();
const students = require("../controllers/student.controller.js");
const verifyToken = require("../middleware/auth.middleware.js");

// Creare elev nou
router.post("/", verifyToken, students.create);

// Returnează toți elevii dintr-o școală
router.get("/", verifyToken, students.findAllinSchool);

// Returnează toți elevii dintr-o clasă
router.get("/:classId", verifyToken, students.findAllinClass);

// Returnează un singur elev după ID
router.get("/:studentId", verifyToken, students.findOne);

// Actualizează un elev după ID
router.put("/:studentId", verifyToken, students.update);

// Șterge un elev după ID
router.delete("/:studentId", verifyToken, students.delete);

module.exports = router;
*/