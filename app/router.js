const express = require('express');
const config = require('config');
const app = require('./../index.js');
const {CDN_PREFIX, API_PREFIX, ENTITIES} = require('./../constants');

const getEntity = require('./controllers/get-entity');
const getEntities = require('./controllers/get-entities');

module.exports = () => {
    app.use(CDN_PREFIX, express.static(config.builder.destination + '/' + ENTITIES.ATTACHMENTS));

    config.supportedEntities.forEach(entity => {
        if (entity === ENTITIES.ATTACHMENTS) {
            return; // skip attachments
        }

        app.get(API_PREFIX + `/${entity}/:slug`, async (req, res) => {
            await controllerAction(req, res, entity, getEntity)
        });

        app.get(API_PREFIX + `/${entity}`, async (req, res) => {
            await controllerAction(req, res, entity, getEntities)
        })
    })

    app.use((req, res) => {
        return res.status(404).json({
            error: 'Not found',
            code: 404
        });
    })
};

async function controllerAction(req, res, entity, controller) {
    try {
        const params = {...req.params, ...req.query, entity};
        const result = await controller(params);

        return res.status(200).json(result);
    } catch (err) {
        console.error(`Error on request process`, err);
        if(err.code === 404) {
            return res.status(404).json({
                error: err.message,
                code: 404
            });
        }
        return res.status(500).json({
            error: 'Service error',
            code: 500
        });
    }
}
