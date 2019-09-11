const { query } = require('../db')

class JobOffersModel {
    static getJobOffers() { return query('SELECT * FROM job_offers') }
    static createJobOffer(fields) {
        const values = Object.values(fields)
        const columns = Object.keys(fields).join(',')
        const placeHolders = values.map((value, index) => `$${index}`).join(',')
        return query(`INSERT INTO job_offers (${columns}) VALUES (${placeHolders}) RETURNING *`, values)
    }

}

module.exports = JobOffersModel