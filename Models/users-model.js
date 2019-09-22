const models = require('../Models/index')
const PortfoliosModel = models.portfolios
const Project = models.portfolio_projects
// const sequelize = require('../ormDB')
// const Project = require('./projects-model')
// const Sequelize, { Model } = require('sequlize')

// class User extends Model {}

// User.init({
//     email: Sequelize.STRING,
//     password: Sequelize.STRING,
//     name: Sequelize.STRING,
// }, { sequelize, modelName: 'user' })

// User.hasMany(Portfolio)

// module.exports = User
const { query } = require('../db')
const JobOffersModel = require('./job-offers-model')

class UserModel {

    static getUsers() { return query('SELECT id, name, email, created_at, updated_at FROM users') }
    static createUser(name, email, password) { return query('INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *', [name, email, password]) }
    static deleteUser(id) { return query('DELETE FROM users WHERE id = $1', [id]) }
    static getSingleUser(id) { return query(`SELECT * FROM users WHERE id= $1`, [id]) }
    static async findUserByEmail(email) {
        const res = await query('SELECT * FROM users WHERE email = $1', [email])
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

    async createPortfolio(fields) {
        console.log(fields)
        fields.user_id = this.id
        return PortfoliosModel.create(fields, {
            include: [
                {
                    model: Project,
                    as: 'projects'
                }
            ]
        }).then((value) => {
            return value.reload()
        })
    }
}


module.exports = UserModel

// 
// req.user.getJobOffers()