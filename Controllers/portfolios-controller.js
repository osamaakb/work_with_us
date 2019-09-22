const router = require('express').Router();
const passport = require('passport')
const { constructResponse } = require('../Services/response')
const validate = require('../validation/index')
const portfolioSchema = require('../validation/portfolioSchema')
const { auth } = require('../intializers/passport')
const models = require('../Models/index')
const { pageInformation } = require('../Services/GlobalService')
const PortfoliosModel = models.portfolios
const Project = models.portfolio_projects



router.get('/search/:query', async (req, res) => {
    const { query } = req.params
    const { after } = req.query
    const portfolios = await PortfoliosModel.search(query, after)

    const count = await PortfoliosModel.countSearch(query)
    let pageInfo
    if (portfolios.length > 0) {
        pageInfo = {
            next: portfolios[portfolios.length - 1].id,
            previous: portfolios[0].id,
            totalCount: count
        }
    } else {
        pageInfo = {
            totalCount: count
        }
    }
    res.json(constructResponse(portfolios, { pageInfo }))
})


router.put('/post/:id', auth, async (req, res) => {
    let portfolio = {}
    const { id } = req.params
    if (req.user.admin) {
        portfolio = await PortfoliosModel.update({ is_published: true }, { where: { id: id }, returning: true })
    } else {
        portfolio[1] = 'you are not an admin try again'
    }
    res.json(constructResponse(portfolio[1]))
})

router.get('/admin/:id*?', auth, validate(portfolioSchema.query, 'query'), async (req, res) => {
    const query = req.query
    const { id } = req.params
    let portfolios
    if (req.user.admin) {
        if (id) {
            portfolios = await PortfoliosModel.findAllAfter(query, id)
        } else {
            portfolios = await PortfoliosModel.scope('withAssociations', 'limitOrder', 'unPublished').findAll({
                where: query,
            })
        }
    } else {
        portfolios = {}
    }
    const count = await PortfoliosModel.count({
        where: query
    })

    res.json(constructResponse(portfolios, pageInformation(portfolios, count)))
})


router.get('/:id*?', validate(portfolioSchema.query, 'query'), async (req, res) => {
    const query = req.query
    const { id } = req.params
    let portfolios
    if (id) {
        portfolios = await PortfoliosModel.findAllAfter(query, id)
    } else {
        portfolios = await PortfoliosModel.scope('withAssociations', 'limitOrder', 'published').findAll({
            where: query,
        })
    }
    const count = await PortfoliosModel.count({
        where: query
    })

    const page = pageInformation(portfolios, count)
    res.json(constructResponse(portfolios, page))
})

router.post('/', auth, async (req, res) => {
    const fields = req.body
    const portfolio = await req.user.createPortfolio(fields)
    res.json(constructResponse(portfolio))
})

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
    const isPortfolio = await PortfoliosModel.findOne({ where: { id: id } })
    if ((isPortfolio && req.user.id === isPortfolio.user_id) || (req.user.admin)) {
        await PortfoliosModel.destroy({ where: { id: id } })
        res.status(200).json(constructResponse([]))
    } else {
        res.status(403).json(constructResponse("You are not allowed to delete this portfolio", { success: false }))
    }
})




router.put('/:id', auth, async (req, res) => {
    const fields = req.body
    const { id } = req.params
    const portfolio = await PortfoliosModel.update(fields, { where: { id: id }, returning: true, })
    res.json(constructResponse(portfolio[1]))
})

router.put('/projects/:id', auth, async (req, res) => {
    const fields = req.body
    const { id } = req.params
    const project = await Project.update(fields, { where: { id: id }, returning: true, })
    res.json(constructResponse(project[1]))
})


module.exports = router