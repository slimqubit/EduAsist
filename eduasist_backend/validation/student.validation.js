// validation/student.validation.js

const Joi = require('joi');

const studentValidationSchema = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  cnp: Joi.string().length(13).required(),
  dateOfBirth: Joi.date().required(),
  genderId: Joi.number().required(),
  address: Joi.string().min(5).required(),
  schoolId: Joi.number().required(),
  classId: Joi.number().required()
});

module.exports = studentValidationSchema;
