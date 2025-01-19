const Joi = require('joi');





const mistriRegisterValidator = Joi.object({
    mistriname: Joi.string().required().messages({
        'string.empty': 'Mistriname is required',
        'any.required': 'Mistriname is required'
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
    role: Joi.string().default('mistri'),
    address: Joi.string().required().messages({
        'string.empty': 'Address is required',
        'any.required': 'Address is required'
    }),
    charges: Joi.number().min(200).required().messages({
        'number.base': 'Charges must be a number', // If the value is not a number
        'number.empty': 'Charges is required', // If the value is empty
        'number.min': 'Charges must be at least 200', // If the number is less than 200
        'any.required': 'Charges is required' // If the field is required but not provided
    }),
    createdAt: Joi.date().default(Date.now),
    orders: Joi.string().optional(),  // Assuming it's an ObjectId in string form
    ratings: Joi.string().default("0"),
    isVerified: Joi.boolean().default(false),
    isAvailable: Joi.boolean().default(true),
    profession: Joi.string().required().messages({
        'string.empty': 'Profession is required',
        'any.required': 'Profession is required'
    })
});

module.exports = { mistriRegisterValidator };
