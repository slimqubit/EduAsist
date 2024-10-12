// controllers/student.controller.js
const db = require("../models");
const Product = db.product;
const StockMovement = db.stock_movement;
const StockSnapshot = db.stock_snapshot;
const TypeUnit = db.type_unit;

const Sequelize = require("sequelize");
const sequelize = require('../models/database'); // Conexiunea la baza de date

const { Op, fn, col } = require('sequelize');

{/*
expected json:

    

interface product {
    id?: number
    name: string;               
    quantity: number;
    unitOfMeasure: string;
    expirationDate: date;    
    movementDate: string;
}



    */}

exports.stockIn = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        let id = 0;
        const { name, quantity, unitId, expirationDate, movementDate } = req.body;

        const [product, created] = await Product.upsert(
            {
                name: name,
                expirationDate: expirationDate,
                unitId: unitId,
                stock: quantity,
                schoolId: schoolId,
            },
            {
                returning: true, // Return the created or updated product
                conflictFields: ['name', 'expirationDate', 'unitId', 'schoolId'], // Set conflict fields to identify existing product
            }
        );

        id = product.id;

        // If product already exists, increment the stock value
        if (!created) {
            await product.increment('stock', { by: quantity, where: { id: id } });
        }

        if (id !== 0) {
            const [movement, created] = await StockMovement.upsert(
                {
                    movementType: 'IN',
                    quantity: quantity,
                    movementDate: movementDate,
                    productId: id,
                },
                {
                    returning: true, // Return the created or updated product
                    conflictFields: ['movementType', 'movementDate', 'productId'], // Set conflict fields to identify existing product
                }
            );

            if (!created) {
                await StockMovement.increment('quantity', { by: quantity, where: { productId: id }});
            }

            res.status(201).send(movement);
        } else {
            res.status(400).send({ message: "Nu a fost posibil identificarea produsului dupa ID." });
        }

    } catch (err) {
        res.status(500).send({ message: err.message || "A apărut o eroare la salvarea datelor." });
    }
};



exports.stockOut = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        const productId = req.params.productId;
        const { quantity, movementDate } = req.body;

        // ensure product exists
        const productExists = await Product.findByPk(productId);
        if (!productExists) return res.status(400).send({ message: `Produsul cu id-ul ${productId} nu există` });

        const _movement = {
            movementType: 'OUT',
            quantity: quantity,
            movementDate: movementDate,
            productId: productId,
        }
        const movement = await StockMovement.create(_movement);
        res.status(201).send(movement);


    } catch (err) {
        res.status(500).send({ message: err.message || "A apărut o eroare la salvarea datelor." });
    }
};


exports.findAllProductNames = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        const products = await Product.findAll({
            where: { schoolId: schoolId },
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('name')), 'name']
            ],
            order: [['name', 'ASC']] // Order by name in ascending order
        });
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving classes." });
    }
};

exports.findAllProductNamesEx = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        const products = await Product.findAll({
            where: { schoolId: schoolId },
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('name')), 'name'], 'expirationDate'
            ],
            order: [['name', 'ASC']] // Order by name in ascending order
        });
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving classes." });
    }
};


exports.findAllProducs = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;
        if (!schoolId) return res.status(400).send({ message: "School ID is required" });

        const products = await Product.findAll({ 
            where: { schoolId: schoolId },
            order: [['name', 'ASC']],
            include: [
                { model: TypeUnit, as: 'type_unit', attributes: ['unit'] }           
            ]
        });

        res.status(200).send(products);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving classes." });
    }
};
