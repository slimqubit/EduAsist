// server.js

require('dotenv').config();


const fs = require('fs');

// Check the environment
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    const logStream = fs.createWriteStream('Server.log', { flags: 'a' }); // flags: 'a' pentru a adăuga în fișier, nu pentru a suprascrie

    // Suprascrie console.log pentru a trimite logurile în server.log
    console.log = function (message) {
        logStream.write(`[INFO] ${new Date().toISOString()} - ${message}\n`);
    };

    // Suprascrie console.error pentru a trimite erorile în server.log
    console.error = function (message) {
        logStream.write(`[ERROR] ${new Date().toISOString()} - ${message}\n`);
    };
} else {
    // In development, use the default console behavior
    console.log('Running in development mode, logging to console.');
}

const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
const db = require("./models");
//db.sequelize.sync();  // Consider changing this for production use

// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the CRUD application." });
});

// Routes
require("./routes/authRoutes")(app);
require("./routes/schoolRoutes")(app);
require("./routes/classRoutes")(app);
require("./routes/studentRoutes")(app);
require("./routes/typeRoutes")(app);
require("./routes/utilsRoutes")(app);
require("./routes/stockRoutes")(app);
require("./routes/somatommRoutes")(app);


// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
