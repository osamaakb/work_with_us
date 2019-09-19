const router = require('express').Router();
const JobOffersModel = require('../Models/job-offers-model')
const SkillsModel = require('../Models/skills-model')
const passport = require('passport')
const { constructResponse } = require('../Services/response')
const { auth } = require('../intializers/passport')


router.get('/:id*?', async (req, res) => {
    const jobOffers = await JobOffersModel.getJobOffers(req.query,req.params.id)
    const count = await JobOffersModel.JobOffersCount()
    const pageInfo = {
        next: jobOffers.rows[jobOffers.rows.length - 1].id,
        previous: jobOffers.rows[0].id,
        totalCount: parseInt(count.rows[0].count)
    }

    res.json(constructResponse(jobOffers.rows, {pageInfo}))
})

router.post('/', auth, async (req, res) => {
    const fields = req.body
    const skills = fields.skills
    delete fields.skills
    const jobOffer = await req.user.createJobOffer(fields, skills)
    // const skillsRes = await SkillsModel.createSkills(skills, jobOffer.rows[0].id)
    // jobOffer.rows[0].skills = skillsRes.rows
    res.status(201).json(constructResponse(jobOffer[4].rows[0]))
})

router.put('/', auth, async (req, res) => {
    const fields = req.body
    const skills = fields.skills
    delete fields.skills
    const jobOffer = await req.user.updateJobOffer(fields, skills)
    // const skillsRes = await SkillsModel.createSkills(skills, jobOffer.rows[0].id)
    // jobOffer.rows[0].skills = skillsRes.rows
    res.status(201).json(constructResponse(jobOffer[4].rows[0]))
})



router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
    const jobOffer = await JobOffersModel.findJobOfferById(id)
    if (jobOffer && req.user.id === jobOffer.user_id) {
        await jobOffer.deleteJobOffer()
        res.status(201).json(constructResponse([]))
    } else {
        res.status(403).json(constructResponse("You are not allowed to delete this job offer", { success: false }))
    }
})


module.exports = router
