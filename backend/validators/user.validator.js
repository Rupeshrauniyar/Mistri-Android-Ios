const Joi = require('joi');

const userRegisterValidator = Joi.object({
    username: Joi.string().required().messages({
        'string.empty': 'Username is required',
        'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password should contain at least 8 characters',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character',
            'any.required': 'Password is required'
        }),
    contactNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
        'string.empty': 'Contact number is required',
        'string.length': 'Contact number must be exactly 10 digits',
        'string.pattern.base': 'Contact number must contain only digits',
        'any.required': 'Contact number is required'
    }),
    address: Joi.string().required().messages({
        'string.empty': 'Address is required',
        'any.required': 'Address is required'
    }),
    role: Joi.string().default('user'),
    createdAt: Joi.date().default(Date.now),
    orders: Joi.array().items(Joi.string()).optional() // Assuming ObjectId stored as a string
});

module.exports = { userRegisterValidator };
