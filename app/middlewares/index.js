const cors = require('cors');
const config = require('config');

const app = require('./../../index.js');

const allow = config.cors && config.cors.allow;
app.use(cors({
    origin: allow || false,
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

module.exports = {};