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
 * The Restify Server
 *
 * @type {Object}
 */
var server = restify.createServer();
/**
 * Utilities for logging to output
 *
 * @type {Object}
 */
var Log = require('log');
var log = new Log('info');
/**
 * Handle the default errors
 */
server.on('uncaughtException', function (req, res) {
  res.send(500, {"code":"InternalServerError", "message":"The server encountered an unexpected condition."});
});

routes(restify, server);

log.info('Server started.');

server.listen(8080, function () {
  log.info('%s listening at %s', server.name, server.url);
});
