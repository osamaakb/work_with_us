const models = require('../Models/index')
const CategoriesModel = models.categories
const router = require('express').Router();
const { constructResponse } = require('../Services/response')


router.get('/', async (req, res, next) => {
    const categories = await CategoriesModel.findAll();
    res.json(constructResponse(categories))
})

module.exports = router