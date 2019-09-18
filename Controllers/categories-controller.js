const models = require('../Models/index')
const CategoriesModel = models.categories
const router = require('express').Router();
const { constructResponse } = require('../Services/response')


router.get('/', async (req, res, next) => {
    const categories = await CategoriesModel.findAll();
    res.json(constructResponse(categories))
})

router.post('/', async (req, res, next) => {
    try {
        const { title } = req.body
        const categories = await CategoriesModel.create({ title: title });
        console.log(categories)
        res.json(constructResponse(categories))
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    await CategoriesModel.destroy({ where: { id: id } });
    res.json(constructResponse({}))
})



module.exports = router