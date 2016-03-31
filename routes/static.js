/**
 * Static URL routes
 */
'use strict';

module.exports = function (restify, server) {

  server.get('/docs', restify.serveStatic({
    directory: './docs/html',
    file: 'api-endpoints.html'
  }));

};
