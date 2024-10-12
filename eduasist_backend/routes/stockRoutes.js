

module.exports = (app) => {
    const stock = require("../controllers/stock.controller.js");
    const verifyToken = require("../middleware/auth.middleware");
  
    const router = require("express").Router();
  
    // introdu un nou produs pe stoc
    router.post("/schools/:schoolId/stockIn", verifyToken, stock.stockIn);
    router.post("/schools/:schoolId/stockOut/:productId", verifyToken, stock.stockOut);
    router.get("/schools/:schoolId/products", verifyToken, stock.findAllProducs);
    router.get("/schools/:schoolId/productNames", verifyToken, stock.findAllProductNames);
    router.get("/schools/:schoolId/productNamesEx", verifyToken, stock.findAllProductNamesEx);
  

    app.use("/api", router);
  };

  