const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PortfolioModel extends Model {
        static associate(models) {
            PortfolioModel.belongsTo(models.categories)
            PortfolioModel.belongsTo(models.areas)
            PortfolioModel.hasMany(models.portfolio_projects, { as: 'projects', foreignKey: 'portfolio_id' })
        }

        static findAllAfter(query, afterId) {
            const { portfolios } = sequelize.models
            return portfolios.scope('withAssociations', 'limitOrder').findAll({
                where: { ...query, id: { [Op.gt]: afterId } },

            })
        }
    }

    PortfolioModel.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            area_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            job_type: {
                type: DataTypes.ENUM('part', 'full', 'contract')
            },
            phone: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            email: {
                type: DataTypes.TEXT
            },
            lat: {
                type: DataTypes.FLOAT
            },
            lng: {
                type: DataTypes.FLOAT
            },
            website: {
                type: DataTypes.TEXT
            },
            cv: {
                type: DataTypes.TEXT
            },
        }, {
            modelName: 'portfolios',
            sequelize,
            scopes: {
                limitOrder: {
                    limit: 5,
                    order: ['id']
                },
                withAssociations: () => {
                    const { portfolio_projects, categories, areas } = sequelize.models

                    return {
                        include: [{
                            model: portfolio_projects,
                            as: 'projects',
                        },
                        {
                            model: categories,
                            attributes: ['title'],
                            required: true,
                        },
                        {
                            model: areas,
                            attributes: ['title'],
                            required: true,
                        }]
                    }
                }
            }
        });

    return PortfolioModel
}