const { query } = require('../db')

class SkillsModel {
    static createSkill(title) { return query('INSERT INTO VALUES (title) VAULES ($1) RETURNING *', [title]) }
    static createSkills(fieldsArray, jobOfferId) {
        const sql = `
        INSERT INTO skills (title, job_offer_id) VALUES 
            ${fieldsArray.map(element => {
            return `('${element.title}',${jobOfferId})`
        }).join(',')}
             RETURNING *
        `
        return query(sql)
    }

}

module.exports = SkillsModel

/*
INSERT INTO skills (title, job_offer_id) VALUES
('example', 7),
('example 2', 7),
('example 3', 7),
...
*/