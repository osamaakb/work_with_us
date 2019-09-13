const AreasModel = require('../Models/areas-model')
const router = require('express').Router();
const { constructResponse } = require('../Services/response')


router.get('/', async (req, res, next) => {
    const areas = await AreasModel.getAreas();
    res.json(constructResponse(areas.rows))
})

router.post('/', async (req, res, next) => {
    try {
        const { title } = req.body
        const area = await AreasModel.createArea(title);
        console.log(area)
        res.json(constructResponse(area.rows[0]))
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    await AreasModel.deleteArea(id);
    res.json(constructResponse({}))
})



module.exports = router