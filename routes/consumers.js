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

  /**
   * GET: Get a specific consumer
   */
  server.get('/consumers', function(req, res) {
    controller.show(req.headers, function(status, message, consumer) {
      res.header('x-api-key', req.headers['x-api-key']);
      res.header('location', '/consumers');
      if (status === 200) {
        if (consumer) {
          res.send(200, consumer.toResponse());
        } else {
          res.send(400, { 'error': 'Bad Request. The consumer could not be found on the server.' });
        }
      } else {
        res.send(status, { 'error': message });
      }
    });
  });

  /**
   * POST: Register a new consumer
   */
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
   * Get a Consumer's Details
   *
   * @param  {Object}   headers  The headers passed to the API
   * @param  {Function} callback The method to callback when completed
   * @return {Void}
   *
   * @access public
   */
  controller.show = function(headers, callback) {
    if ((!headers.hasOwnProperty('x-api-key'))  || (headers['x-api-key'] === '')) {
      callback(400, 'Bad Request. The consumer could not be found on the server.', null);
    } else {
      models.Consumer.findOne({
        where: { apiKey: headers['x-api-key'] }
      }).then(function(consumer) {
        callback(200, 'Found the Consumer.', consumer);
      }, function(error) {
        callback(400, prepareErrorMessage(error.message), null);
      });
    }
  };

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
            callback(201, 'The Consumer was created.', consumer);
          }, function(error) {
            callback(400, prepareErrorMessage(error.message), null);
          });
        } else {
          callback(400, 'Not Found. The client could not be found on the server.', null);
        }
      });
    }
  };

  /**
   * Prepare the error message for delivery
   *
   * @param  {String} errorMessage The current error message
   * @return {String}              The modified error message
   * @access private
   */
  function prepareErrorMessage(errorMessage) {
    var msg = errorMessage
      .replace('notNull Violation:', 'Validation Error:')
      .replace('pushReceive', 'push.receive')
      .replace('pushInterval', 'push.interval')
      .replace('deviceUUID', 'device.uuid');
    if(msg.charAt(msg.length-1) !== '.') {
      msg += '.';
    }
    return msg;
  }

  return controller;
}
