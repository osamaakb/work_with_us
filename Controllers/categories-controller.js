const CategoriesModel = require('../Models/categories-model')
const router = require('express').Router();
const { constructResponse } = require('../Services/response')


router.get('/', async (req, res, next) => {
    const categories = await CategoriesModel.getCategories();
    res.json(constructResponse(categories.rows))
})

router.post('/', async (req, res, next) => {
    try {
        const { title } = req.body
        const categories = await CategoriesModel.createCategories(title);
        console.log(categories)
        res.json(constructResponse(categories.rows[0]))
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    await CategoriesModel.deleteCategories(id);
    res.json(constructResponse({}))
})



module.exports = router