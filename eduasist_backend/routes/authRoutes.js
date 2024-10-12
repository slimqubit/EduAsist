// routes/auth.routes.js

module.exports = (app) => {
  const authController = require("../controllers/auth.controller.js");

  const router = require("express").Router();

  // Înregistrare utilizator
  router.post("/auth/register", authController.register);

  // Autentificare utilizator
  router.post("/auth/login", authController.login);

  app.use("/api", router);
};



/*
// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller.js");


// Înregistrare utilizator
router.post("/register", authController.register);

// Autentificare utilizator
router.post("/login", authController.login);

module.exports = router;

*/