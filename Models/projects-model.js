// const sequelize = require('../ormDB')
// // const Portfolio = require('./portfolios-model')
const Sequelize = require('sequelize');
const Model = Sequelize.Model

module.exports = (sequelize, DataTypes) => {
    class PortfolioProject extends Model {
    }

    PortfolioProject.init({
        img: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
            modelName: 'portfolio_projects',
            sequelize
        })


    return PortfolioProject
}