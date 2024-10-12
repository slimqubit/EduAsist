// validation/school.validation.js

const Joi = require('joi');

const classValidationSchema = Joi.object({
    grade: Joi.number().min(0).max(13).required(),
    letter: Joi.string().allow(null, ''),
    class_master: Joi.string().required(),
    schoolId: Joi.number().required()
});

module.exports = classValidationSchema;