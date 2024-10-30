module.exports = (app) => {
    const router = require("express").Router();
    const fs = require('fs');
    const path = require('path');
    const db = require("../models");

    router.get('/utils/routes', (req, res) => {
        const routes = [];

        app._router.stack.forEach((middleware) => {
            if (middleware.route) { // Routes registered directly on the app
                routes.push(middleware.route);
            } else if (middleware.name === 'router') { // Routes added as router middleware
                middleware.handle.stack.forEach((handler) => {
                    const route = handler.route;
                    route && routes.push(route);
                });
            }
        });

        res.json(routes.map(route => {
            return {
                path: route.path,
                methods: route.methods
            };
        }));
    });


    router.get('/utils/initialize_data/add_typedata', async (req, res) => {
        try {
            // Read the SQL file
            const sqlFilePath = path.join(__dirname, '..\\config', 'EduAsist_typeData.sql');
            const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');
            const sqlStatements = sqlQuery.split(';').filter(statement => statement.trim() !== '');

            // Execute each SQL statement separately
            for (const statement of sqlStatements) {
                await db.sequelize.query(statement);
            }

            // Send the result back to the client
            res.status(200).json({message: 'SQL script executed successfully'});
        } catch (error) {
            console.error('Error executing SQL script:', error);
            res.status(500).json({ message: 'Error executing SQL script', error: error.message });
        }
    });

    router.get('/utils/initialize_data/add_sampledata', async (req, res) => {
        try {
            // Read the SQL file
            const sqlFilePath = path.join(__dirname, '..\\config', 'EduAsist_sampleData.sql');
            const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');
            const sqlStatements = sqlQuery.split(';').filter(statement => statement.trim() !== '');

            // Execute each SQL statement separately
            for (const statement of sqlStatements) {
                await db.sequelize.query(statement);
            }

            // Send the result back to the client
            res.status(200).json({message: 'SQL script executed successfully'});
        } catch (error) {
            console.error('Error executing SQL script:', error);
            res.status(500).json({ message: 'Error executing SQL script', error: error.message });
        }
    });

    router.get('/utils/drop_tables', async (req, res) => {
        try {
            // Read the SQL file
            const sqlFilePath = path.join(__dirname, '..\\config', 'EduAsist_dropTables.sql');
            const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');
            const sqlStatements = sqlQuery.split(';').filter(statement => statement.trim() !== '');

            // Execute each SQL statement separately
            for (const statement of sqlStatements) {
                await db.sequelize.query(statement);
            }

            // Send the result back to the client
            res.status(200).json({message: 'SQL script executed successfully. You need to restart backend'});
        } catch (error) {
            console.error('Error executing SQL script:', error);
            res.status(500).json({ message: 'Error executing SQL script', error: error.message });
        }
    });

    app.use("/api", router);
};