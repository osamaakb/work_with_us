const { query } = require('../db')

class CategoriesModel {
    static getCategories() { return query('SELECT * FROM categories') }
    static createCategories(title) { return query('INSERT INTO categories (title) VALUES ($1) RETURNING *', [title]) }
    static deleteCategories(id) { return query('DELETE FROM categories WHERE id = $1', [id]) }    
}


module.exports = CategoriesModel
