const recursiveRead = require('recursive-readdir');
const path = require('path');
const {builder: {destination}, supportedEntities} = require('config');
const {ENTITIES} = require('./../constants')

const destinationPath = path.resolve(destination);
const indexes = {
    slugIndex: {},
    timestampsIndex: {}
}

module.exports = {
    load,
    getSlugIndex,
    getTimestampIndex
}

function getSlugIndex() {
    return indexes.slugIndex;
}

function getTimestampIndex() {
    return indexes.timestampsIndex
}

async function load() {
    const jsons = await loadJSONs(supportedEntities.filter(entity => entity !== ENTITIES.ATTACHMENTS));
    const {slugsIndex, timestampsIndex} = buildIndexes(jsons);

    indexes.slugIndex = slugsIndex;
    indexes.timestampsIndex = timestampsIndex;
}

function buildIndexes(jsons) {
    const slugsIndex = {};
    const timestampsIndex = {};

    for(const entity in jsons) {
        slugsIndex[entity] = {}

        jsons[entity].forEach((file) => {
            slugsIndex[entity][file.slug] = file
        })

        timestampsIndex[entity] = jsons[entity].sort((a,b) => {
            return b.timestamps.created - a.timestamps.created;
        })
    }

    return {slugsIndex, timestampsIndex};
}

function loadJSONs(entities) {
    return Promise.all(entities.map(async entity => {
        const folder = destinationPath + '/' + entity;
        try {
            const data = await recursiveRead(folder);
            return [
                entity,
                data.map(file => {
                    return require(file)
                })
            ]
        } catch (err) {
            if (err.code === 'ENOENT') {
                return [entity, []]
            }
        }
    }))
        .then(data => {
            return data.reduce((jsons, entityResult) => {
                const [entity, data] = entityResult;
                jsons[entity] = data;

                return jsons;
            }, {})
        })
}