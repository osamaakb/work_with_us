const router = require('express').Router();
const JobOffersModel = require('../Models/job-offers-model')
const passport = require('passport')
const { constructResponse } = require('../Services/response')
const { auth } = require('../intializers/passport')


router.get('/', async (req, res) => {
    const jobOffers = await JobOffersModel.getJobOffers(req.query)
    res.json(constructResponse(jobOffers.rows))
})

router.post('/', auth, async (req, res) => {
    const fields = req.body
    const jobOffer = await req.user.createJobOffer(fields)
    // fields.user_id = req.user.id
    // const jobOffer = await jobOffersModel.createJobOffer(fields)
    res.status(201).json(constructResponse(jobOffer.rows[0]))
})


router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
    const jobOffer = await JobOffersModel.findJobOfferById(id)
    if (jobOffer && req.user.id === jobOffer.user_id) {
        await jobOffer.deleteJobOffer()
        res.status(201).json(constructResponse([]))
    } else {
        res.status(403).json(constructResponse("You are not allowed to delete this job offer", false))
    }
})


module.exports = router
