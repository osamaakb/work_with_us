const router = require('express').Router();
const UserController = require('./users-controller')
const JobOffersController = require('./job-offers-controller')
const AreasController = require('./areas-controller')
const CategoriesController = require('./categories-controller')
const PortfoliosController = require('./portfolios-controller')
//const AdminController = require('./admin-controller')


router.use('/api/users', UserController)
router.use('/api/offers', JobOffersController)
router.use('/api/areas', AreasController)
router.use('/api/categories', CategoriesController)
router.use('/api/portfolios', PortfoliosController)

// const authorizeAdmin = (req, res, next) => {
//     if (req.user.email.endWith('@workwithus.com')) {
//         next();
//     } else {
//         res.status(400).json(constructResponse('your are not an admin', { success: false }))
//     }
// }
// const adminAuthMiddlewares = [auth, authorizeAdmin]

// app.use('/api/admin', ...adminAuthMiddlewares, AdminController)

module.exports = router