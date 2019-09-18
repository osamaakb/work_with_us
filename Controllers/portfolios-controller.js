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


router.get('/', validate(portfolioSchema.query, 'query'), async (req, res) => {
    const query = req.query
    const portfolios = await PortfoliosModel.findAll({
        where: query,
        order: ['id'],
        include: [{
            model: Project,
            as: 'projects',
        },
        {
            model: Category,
            attributes: ['title'],
            required: true,
        },
        {
            model: Area,
            attributes: ['title'],
            required: true,
        }
        ]
    })
    res.json(constructResponse(portfolios))
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
        res.status(403).json(constructResponse("You are not allowed to delete this job offer", false))
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