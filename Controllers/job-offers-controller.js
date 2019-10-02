const router = require('express').Router();
const JobOffersModel = require('../Models/job-offers-model')
const { auth } = require('../intializers/passport')
const validate = require('../validation/index')
const offerSchema = require('../validation/job-offers-schema')


// put count in a function inside the response
router.get('/search/:query', async (req, res) => {
    const { query } = req.params
    const { after } = req.query
    const jobOffers = await JobOffersModel.search(query, after)
    const count = await JobOffersModel.JobOffersSearchCount(query)
    req.responder.success(jobOffers.rows, count.rows[0].count)
})

router.get('/', async (req, res) => {
    const jobOffers = await JobOffersModel.getJobOffers(req.query, req.query.afterId, true)
    const count = await JobOffersModel.JobOffersCount(req.query, true)
    req.responder.success(jobOffers, count.rows[0].count)  
})

router.post('/', validate(offerSchema.offer) ,auth, async (req, res) => {
    const fields = req.body
    const jobOffer = await req.user.createJobOffer(fields)
    req.responder.created(jobOffer[4].rows[0])
})

router.put('/', auth, async (req, res) => {
    const fields = req.body
    const skills = fields.skills
    delete fields.skills
    const jobOffer = await req.user.updateJobOffer(fields, skills)
    req.responder.success(jobOffer[4].rows[0])
})


router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
    const jobOffer = await JobOffersModel.findJobOfferById(id)
    if ((jobOffer && req.user.id === jobOffer.user_id) || (req.user.admin)) {
        await jobOffer.deleteJobOffer()
        req.responder.success('job offer deleted')
    } else {
        req.responder.unAuthorized()
    }
})

module.exports = router
