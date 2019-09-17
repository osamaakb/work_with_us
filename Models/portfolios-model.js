const sequelize = require('../ormDB')
// const User = require('./users-model')
const Project = require('./projects-model')
const Sequelize = require('sequelize');
const Model = Sequelize.Model

class PortfolioModel extends Model {}


PortfolioModel.init(
    {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        area_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        name: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        job_type:{
            type : Sequelize.ENUM('part','full','contract')
        },
        phone: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        email: {
            type: Sequelize.TEXT
        },
        lat: {
            type: Sequelize.FLOAT
        },
        lng: {
            type: Sequelize.FLOAT
        },
        website: {
            type: Sequelize.TEXT
        },
        cv: {
            type: Sequelize.TEXT
        },
    }, {
        modelName: 'portfolios',
        sequelize,
    });

console.log(PortfolioModel)
    

    PortfolioModel.hasMany(Project, {as: 'projects', foreignKey: 'portfolio_id'})
    // PortfolioModel.belongsTo(User)

    module.exports = PortfolioModel