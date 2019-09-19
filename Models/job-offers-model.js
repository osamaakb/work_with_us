const { query } = require('../db')

class JobOffersModel {



    static JobOffersCount(){
        return query('SELECT COUNT(*) FROM job_offers' )
    }


    static conditioner(queryConditions, id) {
        let areaIdCondition = ''
        let categoryIdCondition = ''
        let afterId = 0
        if (queryConditions.area_id) {
            areaIdCondition = `area_id = ${queryConditions.area_id}`
        }
        if (queryConditions.category_id) {
            categoryIdCondition = `category_id = ${queryConditions.category_id}`
        }
        if(id){
            afterId = id
        }


        return `WHERE job_offers.id > ${afterId}
            ${areaIdCondition ? 'AND' : ''}
            ${areaIdCondition}
            ${categoryIdCondition ? ' AND ' : ''}        
            ${categoryIdCondition}`
    }

    static async getJobOffers(queryConditions, id = null) {
        const whereCondition = this.conditioner(queryConditions, id)
        const result = await query(`
            SELECT 
                job_offers.*,
                categories.title AS category_title,
                areas.title AS area_title,
                CASE
                WHEN COUNT(skills.*) > 0 THEN
                    json_agg(
                        json_build_object(
                            'id', skills.id,
                            'title', skills.title
                        )
                    )
                ELSE
                    '[]'
                END AS skills                
            FROM job_offers
            LEFT OUTER JOIN skills ON skills.job_offer_id = job_offers.id
            INNER JOIN categories ON job_offers.category_id = categories.id
            INNER JOIN areas ON job_offers.area_id = areas.id
            ${whereCondition}
            GROUP BY job_offers.id, categories.id, areas.id
            ORDER BY job_offers.id
            LIMIT 5
            `)


        return result;
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



    static createJobOffer(fields, skills) {
        const values = Object.values(fields)
        const columns = Object.keys(fields).join(',')
        const placeHolders = values.map((value, index) => `$${index + 1}`).join(',')

        const sql = `
        BEGIN;
            INSERT INTO job_offers (${columns}) VALUES (${values.map(value => `'${value}'`).join(',')});
            INSERT INTO skills (title, job_offer_id) VALUES 
            ${skills.map(element => {
            return `('${element.title}', currval('job_offer_id_seq'))`
        }).join(',')};            
        COMMIT;
        
        SELECT 
                job_offers.*,
                categories.title AS category_title,
                areas.title AS area_title,
                CASE
                WHEN COUNT(skills.*) > 0 THEN
                    json_agg(
                        json_build_object(
                            'id', skills.id,
                            'title', skills.title
                        )
                    )
                ELSE
                    '[]'
                END AS skills                
            FROM job_offers
            LEFT OUTER JOIN skills ON skills.job_offer_id = job_offers.id
            INNER JOIN categories ON job_offers.category_id = categories.id
            INNER JOIN areas ON job_offers.area_id = areas.id
            GROUP BY job_offers.id, categories.id, areas.id
            ORDER BY job_offers.id DESC
            LIMIT 1
        `


        console.log(sql)

        return query(sql)
    }


    static updateJobOffer(fields, skills) {

        // const values = Object.values(fields)
        const columns = Object.keys(fields).join(',')


        const sql = `
        BEGIN;
            UPDATE job_offers
            SET (${columns}) = (${Object.values(fields).map(element => {
                return `'${element}'`
            })})
            WHERE id = ${fields.id};
            UPDATE skills
            SET title = s.title
            FROM (VALUES 
                ${skills.map(skill => {return `(${skill.id}, '${skill.title}')`}).join(',')}
            ) as s(id,title)
        
            WHERE job_offer_id = ${fields.id} AND skills.id = s.id;

        COMMIT;

        SELECT 
                job_offers.*,
                categories.title AS category_title,
                areas.title AS area_title,
                CASE
                WHEN COUNT(skills.*) > 0 THEN
                    json_agg(
                        json_build_object(
                            'id', skills.id,
                            'title', skills.title
                        )
                    )
                ELSE
                    '[]'
                END AS skills                
            FROM job_offers
            LEFT OUTER JOIN skills ON skills.job_offer_id = job_offers.id
            INNER JOIN categories ON job_offers.category_id = categories.id
            INNER JOIN areas ON job_offers.area_id = areas.id
            WHERE job_offers.id = ${fields.id}
            GROUP BY job_offers.id, categories.id, areas.id
            
            
            `
            console.log(sql)

            return query(sql)
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


/*
SELECT
    job_offers.id,
    job_offers.title,
    json_agg(skills.*) AS skills
FROM job_offers
LEFT OUTER JOIN skills ON skills.job_offer_id = job_offers.id
GROUP BY job_offers.id;

id | title | skills
---+-------+--------
 7 | no 7  | [{ ... }, { ... }, { .... }]
 8 | no 8  | [{ ... }]



--------------

SELECT
    job_offers.id,
    job_offers.title,
    skills.id AS skill_id
FROM job_offers
LEFT OUTER JOIN skills ON skills.job_offer_id = job_offers.id;

id | title | skill_id
---+-------+--------
 7 | no 7  | 1
 7 | no 7  | 2
 7 | no 7  | 3
 8 | no 8  | 7





--------------



SELECT
    job_offers.id,
    job_offers.title,
    json_agg(skills.*) AS skills
FROM job_offers
LEFT OUTER JOIN skills ON skills.job_offer_id = job_offers.id;

Output: Error


----------------

SELECT
    job_offers.id,
    job_offers.title,
    skills.id AS skill_id
FROM job_offers
LEFT OUTER JOIN skills ON skills.job_offer_id = job_offers.id
GROUP BY job_offers.id;

id | title | skill_count
---+-------+--------
  7          1
  8          1
*/