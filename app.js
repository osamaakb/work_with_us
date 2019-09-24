require('dotenv').config()
const express = require('express')

require('./Models')
const routes = require('./Controllers')

const morgan = require('morgan')
const passport =  require('./intializers/passport')
const { auth } = passport
const { constructResponse } = require('./Services/response')

const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize());
// app.use(RequestResponder.initialize())
app.use(morgan('combined'))

app.use(routes)


app.use(function (req, res, next) {
    res.status(404);
    res.send(constructResponse("Not found", { success: false }));
});

app.use(function (data, req, res, next) {
    console.error(data.stack)
    res.status(500).json(constructResponse(data.message, { success: false }))
})



const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

