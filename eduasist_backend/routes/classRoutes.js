// routes/school.routes.js

module.exports = (app) => {
    const classes = require("../controllers/class.controller.js");
    const verifyToken = require("../middleware/auth.middleware");
  
    const router = require("express").Router();
  
    // Creare clasă nouă
    router.post("/schools/:schoolId/classes", verifyToken, classes.create);
  
    // Returnează toate clasele
    router.get("/schools/:schoolId/classes", verifyToken, classes.findAll);
  
    // Returnează o singură clasă după ID
    router.get("/schools/:schoolId/classes/:classId", verifyToken, classes.findOne);
  
    // Actualizează o clasă după ID
    router.put("/schools/:schoolId/classes/:classId", verifyToken, classes.update);
  
    // Șterge o clasă după ID
    router.delete("/schools/:schoolId/classes/:classId", verifyToken, classes.delete);
  
    app.use("/api", router);
  };

  
  

/*

const express = require('express');
const router = express.Router();
const classes = require("../controllers/class.controller.js");
const verifyToken = require("../middleware/auth.middleware.js");

// Creare clasă nouă
router.post("/", verifyToken, classes.create);

// Returnează toate clasele
router.get("/", verifyToken, classes.findAll);

// Returnează o singură clasă după ID
router.get("/:classId", verifyToken, classes.findOne);

// Actualizează o clasă după ID
router.put("/:classId", verifyToken, classes.update);

// Șterge o clasă după ID
router.delete("/:classId", verifyToken, classes.delete);

module.exports = router;

  */

