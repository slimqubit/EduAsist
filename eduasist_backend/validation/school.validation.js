// validation/school.validation.js

const Joi = require('joi');

const schoolValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(6).required().email(),
  phone: Joi.string().min(8).required(), //.regex(/^[0-9]{10}$/)
  city: Joi.string().min(3).required(),
  county: Joi.string().min(3).required(),
  address: Joi.string().min(5).required(),
  residenceId: Joi.number().required(),
  userId: Joi.number().required()
});

module.exports = schoolValidationSchema;
