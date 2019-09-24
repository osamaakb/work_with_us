const router = require('express').Router();
const passport = require('passport')
const { constructResponse } = require('../Services/response')
const validate = require('../validation/index')
const portfolioSchema = require('../validation/portfolioSchema')
const { auth } = require('../intializers/passport')
const models = require('../Models/index')
const { pageInformation } = require('../Services/global-service')
const PortfoliosModel = models.portfolios
const Project = models.portfolio_projects



router.get('/search/:query', async (req, res) => {
    const { query } = req.params
    const { after } = req.query
    const portfolios = await PortfoliosModel.scope('published', 'limitOrder',{ method: ['search', after, query] }).findAll()
    const count = await PortfoliosModel.scope('published',{ method: ['search', after, query] }).count()
    res.json(constructResponse(portfolios, { count }))
})


router.put('/publish/:id', auth, async (req, res) => {
    let portfolio = {}
    let responseArgs
    let status
    const { id } = req.params
    if (req.user.admin) {
        portfolio = await PortfoliosModel.update({ is_published: true }, { where: { id }, returning: true })
        if (portfolio[0] == 0) {
            responseArgs = ['Does not exist', { success: false }]
            status = 404
        } else {
            responseArgs = [portfolio[1]]
            status = 200
        }
    } else {
        responseArgs = ['Not admin', { success: false }]
        status = 401
    }
    res.status(status).json(constructResponse(...responseArgs))
})

router.get('/admin/:id*?', auth, validate(portfolioSchema.query, 'query'), async (req, res) => {
    const query = req.query
    const { id } = req.params
    let scopes = ['withAssociations', 'limitOrder', 'unPublished']
    let portfolios
    if (req.user.admin) {
        portfolios = await PortfoliosModel.scope(scopes, { method: ['after', id, query] }).findAll()
    } else {
        portfolios = 'Not Admin'
    }
    const count = await PortfoliosModel.scope('unPublished').count({
        where: query
    })
    res.json(constructResponse(portfolios, { count }))
})

// change id to after and put it in the query
router.get('/:id*?', validate(portfolioSchema.query, 'query'), async (req, res) => {
    const query = req.query
    const { id } = req.params
    let scopes = ['withAssociations', 'limitOrder', 'published']

    const portfolios = await PortfoliosModel.scope(scopes, { method: ['after', id, query] }).findAll()

    const count = await PortfoliosModel.scope('published').count({
        where: query
    })
    res.json(constructResponse(portfolios, { count }))
})

router.post('/', auth, async (req, res) => {
    const fields = req.body
    const portfolio = await req.user.createPortfolio(fields)
    res.json(constructResponse(portfolio))
})

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
    const portfolio = await PortfoliosModel.findOne({ where: { id: id } })
    if ((portfolio && req.user.id === portfolio.user_id) || (req.user.admin)) {
        await PortfoliosModel.destroy({ where: { id: id } })
        res.status(200).json(constructResponse([]))
    } else {
        res.status(403).json(constructResponse("You are not allowed to delete this portfolio", { success: false }))
        // errors should be handled by error class
    }
})




router.put('/:id', auth, async (req, res) => {
    const fields = req.body
    const { id } = req.params
    let responseArgs
    let status
    const portfolio = await PortfoliosModel.update(fields, { where: { id: id }, returning: true, })
    if (portfolio[0] === 0) {
        responseArgs = ['Does not exist', { success: false }]
        status = 404
    } else {
        responseArgs = [portfolio[1]]
        status = 200
    }
    res.status(status).json(constructResponse(...responseArgs))
})

router.put('/projects/:id', auth, async (req, res) => {
    const fields = req.body
    const { id } = req.params
    let responseArgs
    let status

    const project = await Project.update(fields, { where: { id: id }, returning: true, })
    if (project[0] === 0) {
        responseArgs = ['Does not exist', { success: false }]
        status = 404
    } else {
        responseArgs = [project[1]]
        status = 200
    }
    res.status(status).json(constructResponse(...responseArgs))
})


module.exports = router