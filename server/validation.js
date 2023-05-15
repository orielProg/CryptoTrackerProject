const Joi = require('@hapi/joi')

const registerSchema = Joi.object({
    username : Joi.string().min(5).required(),
    email : Joi.string().min(6).required().email(),
    password : Joi.string().min(6).required(),
    confirmPassword : Joi.any().equal(Joi.ref("password")).required()
})

const loginSchema = Joi.object({
    email : Joi.string().min(6).required().email(),
    password : Joi.string().min(6).required()
})

const changePasswordSchema = Joi.object({
    password : Joi.string().min(6).required(),
    confirmPassword : Joi.any().equal(Joi.ref("password")).required().label('Confirm password')
    .options({ messages: { 'any.only': 'Passwords do not match'} })
})

module.exports.registerSchema = registerSchema;
module.exports.loginSchema = loginSchema;
module.exports.changePasswordSchema = changePasswordSchema;