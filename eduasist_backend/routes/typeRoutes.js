module.exports = (app) => {
    const types = require("../controllers/type.controller.js");
    const verifyToken = require("../middleware/auth.middleware");
  
    const router = require("express").Router();

    router.get("/types/ages", verifyToken, types.getAllAgeTypes);
    router.get("/types/genders", verifyToken, types.getAllGenderTypes);
    router.get("/types/residences", verifyToken, types.getAllResidenceTypes);
    router.get("/types/measurements", verifyToken, types.getAllMeasurementTypes);
    router.get("/types/units", verifyToken, types.getAllUnitTypes);
    router.get("/types/omsindexmeasurements/:residenceId/:measurementId/:genderId", verifyToken, types.getAllOmsMeasurementsIndex);
    router.get("/types/omsindexmeasurements/byage/:residenceId/:genderId/:ageInMonths", verifyToken, types.getOmsMeasurementsIndexByAge);

    app.use("/api", router);
};

