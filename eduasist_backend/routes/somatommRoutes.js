module.exports = (app) => {
    const somatomms = require("../controllers/somatomm.controller.js");
    const verifyToken = require("../middleware/auth.middleware");

    const router = require("express").Router();

    // Creare măsurătoare nouă
    router.post("/somatomm/:studentId", verifyToken, somatomms.create);

    // Returnează toate măsurătorile unui elev
    router.get("/somatomm/:studentId", verifyToken, somatomms.findAll);

    // Returnează o singură măsurătoare
    router.get("/somatomm/:studentId/:somatommId", verifyToken, somatomms.findOne);

    // Actualizează o măsurătoare după ID
    router.put("/somatomm/:studentId/:somatommId", verifyToken, somatomms.update);

    // Șterge o măsurătoare după ID
    router.delete("/somatomm/:studentId/:somatommId", verifyToken, somatomms.delete);

    // Returnează un raport al măsurătorilor în functie de indicatorul "grade"
    router.get("/schools/:schoolId/somatomm/:grade", verifyToken, somatomms.reportByGrade);

    app.use("/api", router);
};