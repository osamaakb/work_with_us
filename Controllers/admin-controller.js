const { constructResponse } = require('../Services/response');
const router = require('express').Router();
const models = require('../Models/index')
const PortfoliosModel = models.portfolios
const validate = require('../validation/index')
const portfolioSchema = require('../validation/portfolioSchema')
const JobOffersModel = require('../Models/job-offers-model')



router.get('/portfolios/:id*?', validate(portfolioSchema.query, 'query'), async (req, res) => {
    const query = req.query
    const { id } = req.params
    let scopes = ['withAssociations', 'limitOrder', 'unPublished']
    let portfolios
    portfolios = await PortfoliosModel.scope(scopes, { method: ['after', id, query] }).findAll()
    const count = await PortfoliosModel.scope('unPublished').count({
        where: query
    })
    // res.json(constructResponse(portfolios, { count }))
    req.responder.success(portfolios, count)
})


router.put('/portfolios/publish/:id', async (req, res) => {
    let portfolio = {}
    const { id } = req.params
    portfolio = await PortfoliosModel.update({ is_published: true }, { where: { id }, returning: true })
    req.responder.updateResponse(portfolio)
})


router.put('/offers/publish/:id', async (req, res) => {
    const { id } = req.params
    const jobOffers = await JobOffersModel.updatePublished(id)
    req.responder.success(jobOffers.rows[0])
})

router.get('/offers/:id*?', async (req, res) => {
    const jobOffers = await JobOffersModel.getJobOffers(req.query, req.params.id, false)
    const count = await JobOffersModel.JobOffersCount() // fix and add query to the count)
    req.responder.success(jobOffers, count.rows[0].count)
})

router.delete('/user', async (req, res) => {
    await UserModel.deleteUser(req.user.id)
    res.json(constructResponse())
}
)

module.exports = router

// router.put('/job/publish', (req, res, next) => {

// })