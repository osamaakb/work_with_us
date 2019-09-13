const { query } = require('../db')

class AreaModel {
    static getAreas() { return query('SELECT * FROM areas') }
    static createArea(title) { return query('INSERT INTO areas (title) VALUES ($1) RETURNING *', [title]) }
    static deleteArea(id) { return query('DELETE FROM areas WHERE id = $1', [id]) }    
}


module.exports = AreaModel
