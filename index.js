process.env.NODE_ENV = process.env.NODE_ENV || 'local';
const express = require('express');
const config = require('config');
const constants = require('./constants');
const {load: loadEntities} = require('./app/loader');

const app = express();
const port = config.port || constants.DEFAULT_PORT;

module.exports = app;

require('./app/middlewares')
require('./app/router')();

loadEntities()
    .then(() => {
        app.listen(port, () => console.info(`App listen on port ${port}!`));
    })

