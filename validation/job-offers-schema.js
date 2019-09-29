const Joi = require('@hapi/joi')


const offerSchema = {
    offer : Joi.object().unknown().keys({
        area_id: Joi.number().integer().required(),
        category_id: Joi.number().integer().required(),
        operating_time: Joi.required(),
        job_title: Joi.string().required(),
        posted_at: Joi.required(),
        poeple_required: Joi.required(),
        apply_method: Joi.required(),
        posted_at: Joi.any(),
        created_at: Joi.any(),
    })
}



module.exports = offerSchema;
