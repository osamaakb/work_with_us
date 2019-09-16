
const { query } = require('../db')
const JobOffersModel = require('./job-offers-model')

class UserModel {

    static getUsers() { return query('SELECT id, name, email, created_at, updated_at FROM users') }
    static createUser(name, email, password) { return query('INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *', [name, email, password]) }
    static deleteUser(id) { return query('DELETE FROM users WHERE id = $1', [id]) }
    static getSingleUser(id) { return query(`SELECT * FROM users WHERE id= $1`, [id]) }
    static async findUserByEmail(email) {
        const res = await query('SELECT * FROM users WHERE email = $1' ,[email])
        if (res.rows) return new UserModel(res.rows[0])
        return null
    }

    constructor(fields) {
        Object.keys(fields).forEach(key => {
            this[key] = fields[key]
        })
    }

    createJobOffer(fields, skills) {
        fields.user_id = this.id;
        return JobOffersModel.createJobOffer(fields, skills);
    }

    updateJobOffer(fields, skills) {
        fields.user_id = this.id;
        return JobOffersModel.updateJobOffer(fields, skills);
    }


    getJobOffers() {
        return JobOffersModel.findByUserId(this.id);
    }
}


module.exports = UserModel

// 
// req.user.getJobOffers()