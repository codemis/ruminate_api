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

  var controller = ConsumerController(models);

  server.post('/consumers/register', function(req, res) {
    controller.create(req.headers, req.params, function(status, message, consumer) {
      if (status === 201) {
        if (consumer) {
          res.header('x-api-key', consumer.apiKey);
          res.send(201, consumer.toResponse());
        } else {
          res.header('x-api-key', '');
          res.send(500, { 'error': 'Internal Server Error. The server encountered an unexpected condition.' });
        }
      } else {
        res.header('x-api-key', '');
        res.send(status, { 'error': message });
      }
    });
  });

};
/**
 * The Consumer Controller
 * @access public
 */
function ConsumerController(models) {
  /**
   * Store the controller object
   *
   * @param {Object}
   */
  var controller = new Object();

  /**
   * Create a new Consumer
   *
   * @param  {Object}   headers  The headers passed to the API
   * @param  {Object}   params   The parameters passed to the API
   * @param  {Function} callback The method to callback when completed
   * @return {Void}
   *
   * @access public
   */
  controller.create = function(headers, params, callback) {
    if ((!headers.hasOwnProperty('x-client-id'))  || (headers['x-client-id'] === '')) {
      callback(400, 'Bad Request. The client could not be found on the server.', null);
    } else if ((isObjectEmpty(params)) || (isObjectEmpty(params.device)) || (isObjectEmpty(params.push))) {
      callback(400, 'Bad Request. The data you provided is malformed or missing.', null);
    } else {
      models.Client.findOne({
        where: { applicationId: headers['x-client-id'] }
      })
      .then(function(client) {
        if (client) {
          var data = models.Consumer.parseRequest(params);
          client.createConsumer(data)
          .then(function(consumer) {
            callback(201, 'Not Found. The client could not be found on the server.', consumer);
          });
        } else {
          callback(400, 'Not Found. The client could not be found on the server.', null);
        }
      });
    }
  };

  return controller;
}
