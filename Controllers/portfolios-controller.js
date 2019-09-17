const router = require('express').Router();
const passport = require('passport')
const { constructResponse } = require('../Services/response')
const { auth } = require('../intializers/passport')
const PortfoliosModel = require('../Models/portfolios-model')
const Project = require('../Models/projects-model')



router.get('/', async (req, res) => {
    const portfolios = await PortfoliosModel.findAll({
        order:['id'],
        include: [{
                model: Project,
                as: 'projects'
            }]
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
    const {id} = req.params
    const portfolio = await PortfoliosModel.update(fields, { where: { id: id }, returning: true, })
    res.json(constructResponse(portfolio[1]))
})

router.put('/projects/:id', auth, async (req, res) => {
    const fields = req.body
    const {id} = req.params
    const project = await Project.update(fields, { where: { id: id }, returning: true, })
    res.json(constructResponse(project[1]))
})


module.exports = router