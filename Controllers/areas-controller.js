const models = require('../Models/index')
const AreasModel = models.areas
const router = require('express').Router();
const { constructResponse } = require('../Services/response')


router.get('/', async (req, res, next) => {
    const areas = await AreasModel.findAll();
    res.json(constructResponse(areas))
})

router.post('/', async (req, res, next) => {
    try {
        const { title } = req.body
        const area = await AreasModel.create({ title });
        console.log(area)
        res.json(constructResponse(area))
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    await AreasModel.describe({ where: { id: id } });
    res.json(constructResponse({}))
})



module.exports = router