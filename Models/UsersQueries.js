const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool()

pool.on('error', (err, client) => {
    console.error('Unxpected error', err)
    process.exit(-1);
})


const getUsers = (request, response) => {
    ;(async => {
        const client = await pool.connect()
        try {
            const res = await client.query('SELECT * FROM users')
            response.status(200).json(res.rows)
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
}

const createUser = (request, response) => {
    const { name, email, password } = request.body
    ;(async => {
        const client = await pool.connect
        try{
            const res = await client.query('INSERT INTO users (name, email, password) VALUES ($1,$2,$3)', [name, email, password])
            response.status(201).send(`User created ${res.ins}`)
        }finally{
            client.release()
        }
    })().catch(e => console.log(e.stack))
}





module.exports = {
    createUser,
    getUsers
}