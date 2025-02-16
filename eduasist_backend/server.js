// server.js

require('dotenv').config();


const fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

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

var credentials = { key: privateKey, cert: certificate };
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
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const HTTPS_PORT = process.env.HTTPS_PORT || 8081;

//app.listen(PORT, () => {
//    console.log(`Server is running on port ${PORT}.`);
//});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(HTTP_PORT, () => {
    console.log(`Server is handling http requests on port ${HTTP_PORT}.`);
});
httpsServer.listen(HTTPS_PORT, () => {
    console.log(`Server is handling https requests on port ${HTTPS_PORT}.`);
});