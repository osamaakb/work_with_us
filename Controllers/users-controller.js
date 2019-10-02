
const UserModel = require('../Models/users-model')
const router = require('express').Router();
const UserServices = require('../Services/users-services')
const passport = require('passport')
const { auth } = require('../intializers/passport')
const { constructResponse } = require('../Services/response')
const jwt = require('jsonwebtoken')
const validate = require('../validation/index')
const secret = process.env.SECRET
const userSchema = require('../validation/userSchema')


router.get('/', async (req, res, next) => {
    const users = await UserModel.getUsers();
    res.json(constructResponse(users.rows))
})

// sign up
router.post('/',
    validate(userSchema.signup)
    , async (req, res, next) => {
        const { name, email, password } = req.body
        const hashedPass = await UserServices.hashPass(password)
        const { rows } = await UserModel.createUser(name, email, hashedPass)
        let token = jwt.sign({ email: email }, secret);  // simplify
        res.json(constructResponse({ user: rows[0], token }))
    })

router.get('/me', auth, (req, res, next) => {
    res.json(constructResponse(req.user))
})

// login
router.post('/login', validate(userSchema.login), async (req, res, next) => {
    const { email, password } = req.body
    const user = await UserModel.findUserByEmail(email)
    if (user) {
        const checkPass = await UserServices.checkPass(password, user.password)
        if (checkPass) {
            let token = jwt.sign({ email: email }, secret);
            delete user.password
            res.json(constructResponse({ user, token }))
        } else {
            res.status(401).json({ message: 'invalid login, Check your password' }) // simplify
        }
    } else {
        res.status(401).json({ message: 'invalid login,  Check your email' })
    }

})

// router.delete('/me', auth, async (req, res, next) => {
//     await UserModel.deleteUser(req.user.id)
//     res.json(constructResponse('deleted'))
// }
// )

router.get('/:id([0-9]+)', async (req, res, next) => {
    const { id } = req.params
    const user = await UserModel.getSingleUser(id)
    res.json(constructResponse(user.rows[0]))
})

module.exports = router
