const router = require('express').Router();
const JobOffersModel = require('../Models/job-offers-model')
const SkillsModel = require('../Models/skills-model')
const passport = require('passport')
const { constructResponse } = require('../Services/response')
const { auth } = require('../intializers/passport')




router.get('/search/:query', async (req, res) => {
    const { query } = req.params
    const { after } = req.query
    const jobOffers = await JobOffersModel.search(query, after)
    const count = await JobOffersModel.JobOffersSearchCount(query)

    let pageInfo
    if (jobOffers.rows.length > 0) {
        pageInfo = {
            next: jobOffers.rows[jobOffers.rows.length - 1].id,
            previous: jobOffers.rows[0].id,
            totalCount: parseInt(count.rows[0].count)
        }
    } else {
        pageInfo = {
            totalCount: parseInt(count.rows[0].count)
        }
    }

    res.json(constructResponse(jobOffers.rows, { pageInfo }))
})



router.put('/publish/:id', auth, async (req, res) => {
    const { id } = req.params
    if (req.user.admin) {
        const jobOffers = await JobOffersModel.updatePublished(id)
        console.log(jobOffers)
        res.json(constructResponse(jobOffers.rows[0]))
    } else {
        res.json(constructResponse({ message: 'you are not admin' }))
    }
})


router.get('/admin/:id*?', auth, async (req, res) => {

    if (req.user.admin) {
        const jobOffers = await JobOffersModel.getJobOffers(req.query, req.params.id, false)
        console.log(jobOffers.rows)
        const count = await JobOffersModel.JobOffersCount()

        let pageInfo
        if (jobOffers.rows.length > 0) {
            pageInfo = {
                next: jobOffers.rows[jobOffers.rows.length - 1].id,
                previous: jobOffers.rows[0].id,
                totalCount: parseInt(count.rows[0].count)
            }
        } else {
            pageInfo = {
                totalCount: parseInt(count.rows[0].count)
            }
        }

        res.json(constructResponse(jobOffers.rows, { pageInfo }))
    } else {
        res.json(constructResponse('not allowed'))

    }
})

router.get('/:id*?', async (req, res) => {
    const jobOffers = await JobOffersModel.getJobOffers(req.query, req.params.id, true)
    const count = await JobOffersModel.JobOffersCount()
    const pageInfo = {
        next: jobOffers.rows[jobOffers.rows.length - 1].id,
        previous: jobOffers.rows[0].id,
        totalCount: parseInt(count.rows[0].count)
    }

    res.json(constructResponse(jobOffers.rows, { pageInfo }))
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
    if ((jobOffer && req.user.id === jobOffer.user_id) || (req.user.admin)) {
        await jobOffer.deleteJobOffer()
        res.status(201).json(constructResponse([]))
    } else {
        res.status(403).json(constructResponse("You are not allowed to delete this job offer", { success: false }))
    }
})


module.exports = router
