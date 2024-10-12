// routes/school.routes.js


module.exports = (app) => {
    const schools = require("../controllers/school.controller.js");
    const verifyToken = require("../middleware/auth.middleware");

    const router = require("express").Router();

    // Creare școală nouă
    router.post("/schools", verifyToken, schools.create);

    // Returnează toate școlile
    router.get("/schools", verifyToken, schools.findAll);

    // Returnează o singură școală după ID
    router.get("/schools/:schoolId", verifyToken, schools.findOne);

    // Actualizează o școală după ID
    router.put("/schools/:schoolId", verifyToken, schools.update);

    // Șterge o școală după ID
    router.delete("/schools/:schoolId", verifyToken, schools.delete);

    app.use("/api", router);
};

/*


const express = require('express');
const router = express.Router();
const schools = require("../controllers/school.controller.js");
const verifyToken = require("../middleware/auth.middleware.js");

// Creare școală nouă
router.post("/", verifyToken, schools.create);

// Returnează toate școlile
router.get("/", verifyToken, schools.findAll);

// Returnează o singură școală după ID
router.get("/:schoolId", verifyToken, schools.findOne);

// Actualizează o școală după ID
router.put("/:schoolId", verifyToken, schools.update);

// Șterge o școală după ID
router.delete("/:schoolId", verifyToken, schools.delete);

module.exports = router;

  */