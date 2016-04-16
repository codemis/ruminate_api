/*jslint node: true, indent: 2 */
'use strict';
/**
 * The Restify library for API development
 *
 * @type {Object}
 */
var restify = require('restify');
/**
 * Load all the routes for the server
 *
 * @type {Object}
 */
var routes  = require('./routes/');
/**
 * Utilities for file system access
 *
 * @type {Object}
 */
var fs = require('fs');
/**
 * Utilities for logging to output
 *
 * @type {Object}
 */
var Log = require('log');
var log = new Log('info');
/**
 * Utilities for configuration settings
 *
 * @type {Object}
 */
var Config = require('./env');
var config = new Config();
/**
 * The Sequelize Model Object
 *
 * @type {Sequelize}
 */
var models = require('./db/models/index');
/**
 * The Restify Server
 *
 * @type {Object}
 */
var server = restify.createServer();
/**
 * parse the body of the passed parameters
 */
server.use(restify.bodyParser({ mapParams: true }));
/**
 * Enable Cors
 */
server.use(restify.CORS(
  {
    origins: ['*'],
    credentials: false,
    headers: ['x-client-id', 'x-api-key', 'location']
  }
));
/**
 * Handle the default errors
 */
server.on('uncaughtException', function (req, res) {
  res.send(500, {"code":"InternalServerError", "message":"The server encountered an unexpected condition."});
});

routes(fs, restify, server, models);

log.info('Server started.');

server.listen(config.port, function () {
  log.info('%s listening at %s', server.name, server.url);
});
