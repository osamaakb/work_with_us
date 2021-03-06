const Sequelize = require('sequelize');
const { Model, Op } = Sequelize;

module.exports = (sequelize, DataTypes) => {
    class PortfolioModel extends Model {
       
        static associate(models) {
            PortfolioModel.belongsTo(models.categories)
            PortfolioModel.belongsTo(models.areas)
            PortfolioModel.hasMany(models.portfolio_projects, { as: 'projects', foreignKey: 'portfolio_id' })
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
            is_published: {
                type: DataTypes.BOOLEAN
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
            website: {
                type: DataTypes.TEXT
            },
            cv: {
                type: DataTypes.TEXT
            },
            rate: {
                type: DataTypes.INTEGER
            },
            rate_count: {
                type: DataTypes.INTEGER
            },
            location: {
                type: DataTypes.TEXT
            },
        }, {
            modelName: 'portfolios',
            sequelize,
            scopes: {
                published: {
                    where: {
                        is_published: true
                    }
                },
                unPublished: {
                    where: { is_published: false }
                },
                limitOrder: {
                    limit: 20,
                    order: ['id']
                },
                after: (afterId, query) => ({
                    where: {
                        [Op.and]: [query],
                        id: { [Op.gt]: afterId || 0 }
                    }
                }),
                search: (afterId, query) => ({
                    where: {
                        [Op.and]: [Sequelize.literal(`portfolios.title ILIKE '${query}%'`)],
                        id: { [Op.gt]: afterId || 0 }
                    }
                }),
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