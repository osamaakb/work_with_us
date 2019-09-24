const router = require('express').Router();
const JobOffersModel = require('../Models/job-offers-model')
// const SkillsModel = require('../Models/skills-model')
// const passport = require('passport')
const { constructResponse, constructPageInfo} = require('../Services/response')
const { auth } = require('../intializers/passport')



// put count in a function inside the response
router.get('/search/:query', async (req, res) => {
    const { query } = req.params
    const { after } = req.query
    const jobOffers = await JobOffersModel.search(query, after)
    const count = await JobOffersModel.JobOffersSearchCount(query)
    res.json(constructResponse(jobOffers.rows, { count: parseInt(count.rows[0].count) }))
})


router.put('/publish/:id', auth, async (req, res) => {
    const { id } = req.params
    if (req.user.admin) {
        const jobOffers = await JobOffersModel.updatePublished(id)
        res.json(constructResponse(jobOffers.rows[0]))
    } else {
        res.json(constructResponse({ message: 'you are not admin' }))
    }
})


router.get('/admin/:id*?', auth, async (req, res) => {
    if (req.user.admin) {
        const jobOffers = await JobOffersModel.getJobOffers(req.query, req.params.id, false)
        const count = await JobOffersModel.JobOffersCount() // fix and add query to the count
        res.json(constructResponse(jobOffers.rows,  { count: parseInt(count.rows[0].count) }))
    } else {
        res.json(constructResponse('not allowed'))
    }
})
// id from params to query
router.get('/:id*?', async (req, res) => {
    const jobOffers = await JobOffersModel.getJobOffers(req.query, req.params.id, true)
    const count = await JobOffersModel.JobOffersCount() // fix and add query to the count
    res.json(constructResponse(jobOffers, { count: parseInt(count.rows[0].count) }))
})

// only send fields
router.post('/', auth, async (req, res) => {
    const fields = req.body
    const skills = fields.skills
    delete fields.skills
    const jobOffer = await req.user.createJobOffer(fields, skills)
    res.status(201).json(constructResponse(jobOffer[4].rows[0]))
})

router.put('/', auth, async (req, res) => {
    const fields = req.body
    const skills = fields.skills
    delete fields.skills
    const jobOffer = await req.user.updateJobOffer(fields, skills)
    res.status(201).json(constructResponse(jobOffer[4].rows[0]))
})



router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
    const jobOffer = await JobOffersModel.findJobOfferById(id)
    if ((jobOffer && req.user.id === jobOffer.user_id) || (req.user.admin)) {
        await jobOffer.deleteJobOffer()
        res.status(201).json(constructResponse([]))
    } else {
        res.status(403).json(constructResponse("You are not allowed to delete this job offer", { success: false }))
    }
})


module.exports = router
