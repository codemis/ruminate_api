/*jslint node: true, indent: 2 */
'use strict';
var restify, routes, server;

restify = require('restify');
routes  = require('./routes/');

server = restify.createServer();

/**
 * Handle the default errors
 */
server.on('uncaughtException', function (req, res, err) {
  console.log('Error!');
  console.log(err);
  res.send(500, {"code":"InternalServerError", "message":"The server encountered an unexpected condition."});
});

routes(restify, server);

console.log('Server started.');

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
