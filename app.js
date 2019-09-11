require('dotenv').config()
const express = require('express')

const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const UserController = require('./Controllers/users-controller')
const JobOffersController = require('./Controllers/job-offers-controller')

app.use('/api/users', UserController)
app.use('/api/offers', JobOffersController)

const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})