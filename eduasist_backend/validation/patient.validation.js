// validation/patient.validation.js
const Joi = require('joi');

const patientValidationSchema = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  cnp: Joi.string().length(13).required(),
  dateOfBirth: Joi.date().required(),
  address: Joi.string().min(5).required()
});

module.exports = patientValidationSchema;
