
const Joi = require('@hapi/joi')


const userSchema = {
    signup: Joi.object().keys({
        name: Joi.string().required().min(3),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(30).required()
    }),
    login: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(30).required()
    })
}


module.exports = userSchema;