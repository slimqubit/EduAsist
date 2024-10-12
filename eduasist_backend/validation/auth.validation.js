// validation/auth.validation.js

const Joi = require('joi');

const registerValidationSchema = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.ref('password')
    });
    return schema.validate(data);
};


const loginValidationSchema = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};


module.exports = { registerValidationSchema, loginValidationSchema };