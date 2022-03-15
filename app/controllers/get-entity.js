const {getBySlug} = require('./../services/entity');

module.exports = async (params) => {
    const item = getBySlug(params);
    if(item)
        return item;

    throw buildNotFoundError(params);
}

function buildNotFoundError({slug, entity}) {
    const NotFoundError = new Error(`Failed to get ${entity} by slug ${slug}`);
    NotFoundError.code = 404;

    return NotFoundError
}