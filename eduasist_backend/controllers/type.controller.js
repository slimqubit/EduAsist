const db = require("../models");
const typeAge = db.type_age;
const typeGender = db.type_gender;
const typeResidence = db.type_residence;
const typeMeasurement = db.type_measurement;
const typeUnit = db.type_unit;
const omsIndexMeasurements = db.omsindex_measurements;

const Sequelize = require("sequelize");
const sequelize = require('../models/database'); // Conexiunea la baza de date

const { Op, fn, col } = require('sequelize');



exports.getAllAgeTypes = async (req, res) => {
    try {
        const data = await typeAge.findAll({
            order: [['id', 'ASC']]
        });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving age types." });
    }
};

exports.getAllGenderTypes = async (req, res) => {
    try {
        const data = await typeGender.findAll({
            order: [['id', 'ASC']]
        });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving gender types." });
    }
};

exports.getAllResidenceTypes = async (req, res) => {
    try {
        const data = await typeResidence.findAll({
            order: [['id', 'ASC']]
        });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving residence types." });
    }
};

exports.getAllMeasurementTypes = async (req, res) => {
    try {
        const data = await typeMeasurement.findAll({
            order: [['id', 'ASC']]
        });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving measurememt types." });
    }
};

exports.getAllUnitTypes = async (req, res) => {
    try {
        const data = await typeUnit.findAll({
            order: [['id', 'ASC']]
        });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving age types." });
    }
};




exports.getAllOmsMeasurementsIndex = async (req, res) => {
    try {
      const residenceId = req.params.residenceId;
      if (!residenceId)  return res.status(400).send({ message: "Residence type ID is required" });
      const measurementId = req.params.measurementId;
      if (!measurementId)  return res.status(400).send({ message: "Mesurement type ID is required" });
      const genderId = req.params.genderId;
      if (!genderId)  return res.status(400).send({ message: "Gender type ID is required" });
  
      const data = await omsIndexMeasurements.findAll({
        include: [{
            model: typeAge,
            attributes: ['description'], 
          }],
          where: { residenceId: residenceId, measurementId: measurementId, genderId: genderId },
          order:[['ageId', 'ASC']]
      });
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ message: err.message || "A apărut o eroare la generarea listei cu elevi." });
    }
  };
  


  exports.getOmsMeasurementsIndexByAge = async (req, res) => {
    try {
      const residenceId = req.params.residenceId;
      if (!residenceId)  return res.status(400).send({ message: "Residence type ID is required" });
      const genderId = req.params.genderId;
      if (!genderId)  return res.status(400).send({ message: "Gender type ID is required" });
      const ageInMonths = req.params.ageInMonths;
      if (!ageInMonths)  return res.status(400).send({ message: "Age in Months is required" });


      const closestAge = await typeAge.findOne({
        where: {
          months: {
            [Sequelize.Op.lte]: ageInMonths  // Obține valoarea mai mică sau egală cu X
          }
        },
        order: [['months', 'DESC']]  // Sortează în ordine descrescătoare pentru a obține valoarea cea mai mare
      });

      const data = await omsIndexMeasurements.findAll({
        include: [{
            model: typeAge,
            attributes: ['description'], 
          }],
          where: { ageId: closestAge.id, residenceId: residenceId, genderId: genderId },
          order:[['measurementId', 'ASC']]
      });

      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ message: err.message || "A apărut o eroare la generarea listei cu elevi." });
    }
  };
