'use strict';

const packageJson = require('../package.json');

module.exports = {
    debug: false,

    port: process.env.PORT,

    dbUrl: process.env.ELEPHANTSQL_URL,

    defaultPicture: 'http://posterposse.com/wp-content/uploads/2017/08/Pennywise-IT-Poster-Posse-Garofalo.png',

    staticBasePath: `//${packageJson.name}.surge.sh/`
};
