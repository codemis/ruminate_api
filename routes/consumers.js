/**
 * Consumers Routes
 */
'use strict';

/**
 * Get the objectIsEmpty Utility
 *
 * @param {Object}
 */
var isObjectEmpty = require('../utilities/is-object-empty');

module.exports = function (restify, server, models) {

  server.post('/consumers/register', function(req, res) {
    var params = req.params;
    if ((!req.headers.hasOwnProperty('x-client-id')) || (req.headers['x-client-id'] === '')) {
      res.header('x-api-key', '');
      res.send(400, { 'error': 'Not Found. The client could not be found on the server.' });
    } else if ((isObjectEmpty(params)) || (isObjectEmpty(params.device)) || (isObjectEmpty(params.push))) {
      res.header('x-api-key', '');
      res.send(400, { 'error': 'Bad Request. The data you provided is malformed or missing.' });
    } else {
      var clientId = req.headers['x-client-id'];
      var consumerData = models.Consumer.parseRequest(params);
      models.Client.findOne({
        where: { applicationId: clientId }
      })
      .then(function(client) {
        if (client) {
          /**
           * register the client
           */
          models.Consumer.create(consumerData)
          .then(function(consumer) {
            res.header('x-api-key', consumer.apiKey);
            res.send(201, consumer.toResponse());
          });
        } else {
          /**
           * Client does not exist
           */
          res.header('x-api-key', '');
          res.send(400, { 'error': 'Not Found. The client could not be found on the server.' });
        }
      });
    }
  });

};
