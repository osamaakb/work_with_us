const { Pool } = require('pg')

const pool = new Pool()

pool.on('error', (err, client) => {
    console.error('Unxpected error', err)
    process.exit(-1);
})

async function query(queryString, ...args) {
    const client = await pool.connect()
    let res;
    try {
         res = await client.query(queryString, ...args)
        console.log(res)        
    }
    finally {
        client.release()  
        return res      
    }
}

module.exports = {query};