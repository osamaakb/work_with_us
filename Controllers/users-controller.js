
const UserModel = require('../Models/users-model')
const router = require('express').Router();


router.get('/', async (req, res) => {
    try {
        const users = await UserModel.getUsers();        
        res.json(users.rows);
    } catch (err) {
        res.status(500)
    }
})


router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log('params', req.body)
        const user = await UserModel.createUser(name, email, password)
        res.status(201).json(user.rows)
    } catch(err) {
        if (err == 'ParamsNotFound') {
            res.status(400)
        } else {
            res.status(500).send(err)
        }
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params
        await UserModel.deleteUser(id)          
        res.json({ status: 'success'})
    }
    catch(err)
    {
        res.status(500).send(err)    
    }    
})

router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params
        const user = await UserModel.getSingleUser(id)
        res.json(user.rows[0])
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router