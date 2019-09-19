const router = require('express').Router();
const passport = require('passport')
const { constructResponse } = require('../Services/response')
const validate = require('../validation/index')
const portfolioSchema = require('../validation/portfolioSchema')
const { auth } = require('../intializers/passport')
const models = require('../Models/index')
const PortfoliosModel = models.portfolios
const Project = models.portfolio_projects
const Category = models.categories
const Area = models.areas


router.get('/:id*?', validate(portfolioSchema.query, 'query'), async (req, res) => {
    const query = req.query
    const { id } = req.params
    let portfolios
    if (id) {
        portfolios = await PortfoliosModel.findAllAfter(query, id)
    } else {
        portfolios = await PortfoliosModel.scope('withAssociations','limitOrder').findAll({
            where: query ,
        })

    }
    const count = await PortfoliosModel.count({
        where: query
    })
    const pageInfo = {
        next: portfolios[portfolios.length - 1].id,
        previous: portfolios[0].id,
        totalCount: count
    }
    res.json(constructResponse(portfolios, { pageInfo }))
})

router.post('/', auth, async (req, res) => {
    const fields = req.body
    const portfolio = await req.user.createPortfolio(fields)
    res.json(constructResponse(portfolio))
})

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
    const isPortfolio = await PortfoliosModel.findOne({ where: { id: id } })
    if (isPortfolio && req.user.id === isPortfolio.user_id) {
        await PortfoliosModel.destroy({ where: { id: id } })
        res.status(201).json(constructResponse([]))
    } else {
        res.status(403).json(constructResponse("You are not allowed to delete this job offer", { success: false }))
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