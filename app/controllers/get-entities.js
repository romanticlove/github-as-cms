const {getEntities} = require('./../services/entity');

module.exports = async (params) => {
    return getEntities(params)
}