const Joi = require('@hapi/joi')


const portfolioSchema = {
    query : Joi.object().keys({
        area_id: Joi.number().integer(),
        category_id: Joi.number().integer(),
    })
}



module.exports = portfolioSchema;
