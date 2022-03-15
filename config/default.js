const {ENTITIES} = require('./../constants');

module.exports = {
    supportedEntities: [ENTITIES.POSTS, ENTITIES.ATTACHMENTS],
    cors: {
        allow: true
    },
    builder: {
        attachmentsFolder: 'attachments',
        source: __dirname + '/../source',
        destination: __dirname + '/../public',
    }
}