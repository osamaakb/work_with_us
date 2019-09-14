const { query } = require('../db')

class JobOffersModel {
    static getJobOffers(queryConditions) {
        let areaIdCondition =''
        let categoryIdCondition =''
        if (queryConditions.area_id) {
            areaIdCondition = `area_id = ${queryConditions.area_id}`
        }
        if (queryConditions.category_id) {
            categoryIdCondition = `category_id = ${queryConditions.category_id}`
        }
        return query(`
            SELECT job_offers.*,
                categories.title AS category_title,
                areas.title AS area_title
            FROM job_offers 
            INNER JOIN categories ON job_offers.category_id = categories.id
            INNER JOIN areas ON job_offers.area_id = areas.id
            ${areaIdCondition || categoryIdCondition ? 'WHERE ' : ''}
            ${areaIdCondition}
            ${areaIdCondition && categoryIdCondition ? ' AND ' : ''}        
            ${categoryIdCondition}
            `)
    }
    static async findJobOfferById(id) {
        const res = await query(`
          SELECT job_offers.*,
            categories.title AS category_title,
            areas.title AS area_title
          FROM job_offers 
          INNER JOIN categories ON job_offers.category_id = categories.id
          INNER JOIN areas ON job_offers.area_id = areas.id
          WHERE job_offers.id = $1`, [id])
        if (res.rows && res.rows.length > 0) return new JobOffersModel(res.rows[0])
    }
    static createJobOffer(fields) {
        const values = Object.values(fields)
        const columns = Object.keys(fields).join(',')
        const placeHolders = values.map((value, index) => `$${index + 1}`).join(',')
        return query(`INSERT INTO job_offers (${columns}) VALUES (${placeHolders}) RETURNING *`, values)
    }
    static findByUserId(id) { return query('SELECT * FROM job_offers WHERE user_id = $1', [id]) }
    static deleteJobOffer(id) { return query('DELETE FROM job_offers WHERE id=$1', [id]) }

    constructor(fields) {
        Object.keys(fields).forEach(key => {
            this[key] = fields[key]
        })
    }

    deleteJobOffer() {
        const id = this.id
        JobOffersModel.deleteJobOffer(id)
    }
}

module.exports = JobOffersModel