module.exports = (app) => {
    const somatomms = require("../controllers/somatomm.controller.js");
    const verifyToken = require("../middleware/auth.middleware");
  
    const router = require("express").Router();
  
    // Creare clasă nouă
    router.post("/somatomm/:studentId", verifyToken, somatomms.create);
  
    // Returnează toate clasele
    router.get("/somatomm/:studentId", verifyToken, somatomms.findAll);
  
    // Returnează o singură clasă după ID
    router.get("/somatomm/:studentId/:somatommId", verifyToken, somatomms.findOne);
  
    // Actualizează o clasă după ID
    router.put("/somatomm/:studentId/:somatommId", verifyToken, somatomms.update);
  
    // Șterge o clasă după ID
    router.delete("/somatomm/:studentId/:somatommId", verifyToken, somatomms.delete);
  
    app.use("/api", router);
  };