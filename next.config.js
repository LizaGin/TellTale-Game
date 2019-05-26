
'use strict';

const config = require('config');
const withCSS = require('@zeit/next-css');
const withTypescript = require('@zeit/next-typescript');

module.exports = withCSS(withTypescript({
    assetPrefix: config.get('staticBasePath'),
    distDir: 'dist/client/_next',
    useFileSystemPublicRoutes: false
}));
