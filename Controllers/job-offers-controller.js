const router = require('express').Router();
const jobOffersModel = require('../Models/job-offers-model')

router.get('/', async (req, res) => {
    try{
    const jobOffers = await jobOffersModel.getJobOffers()
    if(jobOffers.rows.length === 0){
        res.json({meesage: 'No items Available'})
    }
    res.json(jobOffers.rows)
    }catch(err){
        res.status(500).send(err)
    }
})

router.post('/', async (req, res) => {
    try{
        const fields = req.body
        const jobOffer = await jobOffersModel.createJobOffer(fields)
        res.status(201).json(jobOffer.rows)
    } catch(err) {
        if (err == 'ParamsNotFound') {
            res.status(400)
        } else {
            res.status(500).send(err)
        }
    }
})


module.exports = router
