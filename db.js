const { Pool } = require('pg')

const pool = new Pool()

pool.on('error', (err, client) => {
    console.error('Unxpected error', err)
    process.exit(-1);
})

async function query(queryString, ...args) {
    const client = await pool.connect()
    try {
        const res = await client.query(queryString, ...args)
        client.release()
        return res
    } catch (err) {
        client.release()
        throw err
    }

}

module.exports = { query };