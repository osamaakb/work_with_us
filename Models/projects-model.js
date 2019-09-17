const sequelize = require('../ormDB')
// const Portfolio = require('./portfolios-model')
const Sequelize = require('sequelize');
const Model = Sequelize.Model

class PortfolioProject extends Model{}

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


// console.log(Portfolio)
// console.log(PortfolioProject)

// PortfolioProject.belongsTo(Portfolio)

module.exports = PortfolioProject