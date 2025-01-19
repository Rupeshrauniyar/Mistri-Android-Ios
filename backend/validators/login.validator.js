const Joi = require('joi')

const loginValidator = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email is invalid',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password should contain at least 8 characters',
            'any.required': 'Password is required'
        }),

});

module.exports = { loginValidator }