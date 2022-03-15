const {PAGINATION} = require('./../../constants');
const {getTimestampIndex, getSlugIndex} = require('./../loader');

module.exports = {
    getBySlug({entity, slug}) {
        const index = getSlugIndex();

        return index[entity] && index[entity][slug];
    },
    getEntities({entity, page = 1, limit = PAGINATION.DEFAULT_LIMIT}) {
        const index = getTimestampIndex();
        const items = index[entity] || [];

        const offset = limit * (page - 1);

        return {
            page,
            limit,
            total: items.length,
            data: items.slice(offset, page * limit),
        }
    }
}