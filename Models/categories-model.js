const  { Model } = require('sequelize');

// // const { query } = require('../db')

// const sequelize = require('../ormDB')
// // const User = require('./users-model')
// const Project = require('./projects-model')
// const Portfolio = require('./portfolios-model')

// const Sequelize = require('sequelize');
// const Model = Sequelize.Model

// //     static getCategories() { return query('SELECT * FROM categories') }
// //     static createCategories(title) { return query('INSERT INTO categories (title) VALUES ($1) RETURNING *', [title]) }
// //     static deleteCategories(id) { return query('DELETE FROM categories WHERE id = $1', [id]) }    


// module.exports = CategoriesModel
module.exports = (sequelize, DataTypes) => {
    class CategoriesModel extends Model {
        static associate(models) {
            CategoriesModel.hasMany(models.portfolios, {as: 'portfolio', foreignKey: 'category_id'})
        }
     }

    CategoriesModel.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
            sequelize,
            modelName: "categories"
        })

    return CategoriesModel
}