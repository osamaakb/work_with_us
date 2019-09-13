
const { query } = require('../db')


class UserModel {

    static getUsers() { return query('SELECT id, name, email, created_at, updated_at FROM users') }
    static createUser(name, email, password) { return query('INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *', [name, email, password]) }
    static deleteUser(id) { return query('DELETE FROM users WHERE id = $1', [id]) }
    static getSingleUser(id) { return query(`SELECT * FROM users WHERE id= $1`, [id]) }
    static findUserByEmail(email) { return query('SELECT * FROM users WHERE email = $1' ,[email])}
}


module.exports = UserModel
