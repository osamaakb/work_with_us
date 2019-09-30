const router = require('express').Router();
const validate = require('../validation/index')
const portfolioSchema = require('../validation/portfolioSchema')
const { auth } = require('../intializers/passport')
const models = require('../Models/index')
const PortfoliosModel = models.portfolios
const Project = models.portfolio_projects


router.get('/search/:query', async (req, res) => {
    const { query } = req.params
    const { after } = req.query
    const portfolios = await PortfoliosModel.scope('published', 'limitOrder', { method: ['search', after, query] }).findAll()
    const count = await PortfoliosModel.scope('published', { method: ['search', after, query] }).count()
    req.responder.success(portfolios, count)
})

router.get('/', validate(portfolioSchema.query, 'query'), async (req, res) => {
    const query = req.query
    const { afterId } = req.query
    let scopes = ['withAssociations', 'limitOrder', 'published']
    const portfolios = await PortfoliosModel.scope(scopes, { method: ['after', afterId, query] }).findAll()
    const count = await PortfoliosModel.scope('published').count({
        where: query
    })
    req.responder.success(portfolios, count)
})

router.post('/', validate(portfolioSchema.portfolio), auth, async (req, res) => {
    const fields = req.body
    const portfolio = await req.user.createPortfolio(fields)
    req.responder.created(portfolio)
})

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
    const portfolio = await PortfoliosModel.findOne({ where: { id } })
    if ((portfolio) && (req.user.id === portfolio.user_id) || (portfolio) && (req.user.admin)) {
        await PortfoliosModel.destroy({ where: { id } })
        req.responder.success('Deleted')
    } else {
        req.responder.unAuthorized('You are not allowed to delete this portfolio')
    }
})

router.put('/:id', auth, async (req, res) => {
    const fields = req.body
    const { id } = req.params
    const portfolio = await PortfoliosModel.update(fields, { where: { id }, returning: true, })
    req.responder.updateResponse(portfolio)
})

router.put('/projects/:id', auth, async (req, res) => {
    const fields = req.body
    const { id } = req.params
    const project = await Project.update(fields, { where: { id }, returning: true, })
    req.responder.updateResponse(project)
})


module.exports = router