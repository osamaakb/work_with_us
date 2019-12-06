const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
let db = {}
const sequelize = require('../ormDB')



fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file !== 'job-offers-model.js') && (file !== 'skills-model.js') && (file !== 'users-model.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });


Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db


/*
class Sequelize {
    import(path) {
        const definerFn = require(path)
        definerFn(this, DataTypes)
    }
}
*/