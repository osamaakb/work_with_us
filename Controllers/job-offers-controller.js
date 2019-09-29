const router = require('express').Router();
const JobOffersModel = require('../Models/job-offers-model')
// const { constructResponse, constructPageInfo} = require('../Services/response')
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


// router.put('/publish/:id', auth, async (req, res) => {
//     const { id } = req.params
//     if (req.user.admin) {
//         const jobOffers = await JobOffersModel.updatePublished(id)
//         res.json(constructResponse(jobOffers.rows[0]))
//     } else {
//         res.json(constructResponse({ message: 'you are not admin' }))
//     }
// })


// router.get('/admin/:id*?', auth, async (req, res) => {
//     if (req.user.admin) {
//         const jobOffers = await JobOffersModel.getJobOffers(req.query, req.params.id, false)
//         const count = await JobOffersModel.JobOffersCount() // fix and add query to the count
//         res.json(constructResponse(jobOffers.rows,  { count: parseInt(count.rows[0].count) }))
//     } else {
//         res.json(constructResponse('not allowed'))
//     }
// })

router.get('/', async (req, res) => {
    const jobOffers = await JobOffersModel.getJobOffers(req.query, req.query.id, true)
    const count = await JobOffersModel.JobOffersCount() // fix and add query to the count
    req.responder.success(jobOffers, count.rows[0].count)
    
})

// only send fields
router.post('/', validate(offerSchema.offer) ,auth, async (req, res) => {
    const fields = req.body
    const skills = fields.skills
    delete fields.skills
    const jobOffer = await req.user.createJobOffer(fields, skills)
    req.responder.created(jobOffer[4].rows)
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
