const Joi = require('@hapi/joi')


const portfolioSchema = {
    query : Joi.object().keys({
        area_id: Joi.number().integer(),
        category_id: Joi.number().integer(),
        afterId: Joi.number().integer()
    }),
    portfolio : Joi.object().unknown().keys({
        area_id: Joi.number().integer().required(),
        category_id: Joi.number().integer().required(),
        title: Joi.string().required(),
        name: Joi.string().required(),
        phone: Joi.number().integer().required(),
        cv: Joi.string().required(),
        posted_at: Joi.any(),
        created_at: Joi.any(),
    })
}



module.exports = portfolioSchema;
