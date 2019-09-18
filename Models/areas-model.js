const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AreaModel extends Model {
        static associate(models) {
            AreaModel.hasMany(models.portfolios, {as: 'portfolio', foreignKey: 'area_id'})
        }
     }

    AreaModel.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
            sequelize,
            modelName: "areas"
        })
    
    return AreaModel
}