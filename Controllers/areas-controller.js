const models = require('../Models/index')
const AreasModel = models.areas
const router = require('express').Router();
const { constructResponse } = require('../Services/response')


router.get('/', async (req, res, next) => {
    const areas = await AreasModel.findAll();
    res.json(constructResponse(areas))
})

module.exports = router