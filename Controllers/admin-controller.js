const { constructResponse } = require('../Services/response');
const router = require('express').Router();
const models = require('../Models/index')
const PortfoliosModel = models.portfolios
const AreasModel = models.areas
const CategoriesModel = models.categories
const validate = require('../validation/index')
const portfolioSchema = require('../validation/portfolioSchema')
const JobOffersModel = require('../Models/job-offers-model')


router.get('/portfolios', validate(portfolioSchema.query, 'query'), async (req, res) => {
    const query = req.query
    const { afterId } = req.query
    delete query.afterId
    const portfolios = await PortfoliosModel.scope('withAssociations', 'limitOrder', 'unPublished', { method: ['after', afterId, query] }).findAll()
    const count = await PortfoliosModel.scope('unPublished').count({
        where: query
    })
    req.responder.success(portfolios, count)
})

router.put('/portfolios/publish/:id', async (req, res) => {
    const { id } = req.params
    const portfolio = await PortfoliosModel.update({ is_published: true }, { where: { id }, returning: true })
    req.responder.updateResponse(portfolio)
})


router.put('/offers/publish/:id', async (req, res) => {
    const { id } = req.params
    const jobOffers = await JobOffersModel.updatePublished(id)
    req.responder.success(jobOffers.rows[0])
})

router.get('/offers', async (req, res) => {
    const jobOffers = await JobOffersModel.getJobOffers(req.query, req.query.afterId, false)
    const count = await JobOffersModel.JobOffersCount(req.query, false)
    req.responder.success(jobOffers, count.rows[0].count)
})

router.delete('/user', async (req, res) => {
    await UserModel.deleteUser(req.user.id)
    res.json(constructResponse())
})


router.post('/areas', async (req, res, next) => {
    const { title } = req.body
    const area = await AreasModel.create({ title })
    res.json(constructResponse(area))
})

router.delete('/areas/:id', async (req, res, next) => {
    const { id } = req.params
    await AreasModel.destroy({ where: { id: id } });
    res.json(constructResponse('deleted'))
})


router.post('/categories', async (req, res, next) => {
    const { title } = req.body
    const categories = await CategoriesModel.create({ title: title });
    res.json(constructResponse(categories))
})

router.delete('/categories/:id', async (req, res, next) => {
    const { id } = req.params
    await CategoriesModel.destroy({ where: { id: id } });
    res.json(constructResponse({}))
})



module.exports = router