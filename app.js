require('dotenv').config()
const express = require('express')
// expressLogging = require('express-logging'),
//     logger = require('logops');

require('./Models')

const morgan = require('morgan')

const passport = require('./intializers/passport')
const { constructResponse } = require('./Services/response')

const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize());

app.use(morgan('combined'))


const port = 3000

const UserController = require('./Controllers/users-controller')
const JobOffersController = require('./Controllers/job-offers-controller')
const AreasController = require('./Controllers/areas-controller')
const CategoriesController = require('./Controllers/categories-controller')
const PortfoliosController = require('./Controllers/portfolios-controller')


app.use('/api/users', UserController)
app.use('/api/offers', JobOffersController)
app.use('/api/areas', AreasController)
app.use('/api/categories', CategoriesController)
app.use('/api/portfolios', PortfoliosController)



// logger.info('Request from %s: %s %s', clientIpAddress, requestMethod, requestUrl);
// app.use(expressLogging(logger));

app.use(function (req, res, next) {
    res.status(404);
    res.send(constructResponse("Not found", { success: false }));
});

app.use(function (data, req, res, next) {
    if (data instanceof Error) {
        console.error(data.stack)
        res.status(500).json(constructResponse(data.message, { success: false }))
    } else {
        res.json(constructResponse(data))
    }
})



app.listen(port, () => {
    console.log(`App running on port ${port}`)
})