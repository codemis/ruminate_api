/**
 * Ruminations Routes
 */
'use strict';

/**
 * Include the underscore library
 *
 * @param  {Object}
 */
var _ = require('underscore');
/**
 * Get the objectIsEmpty Utility
 *
 * @param {Object}
 */
var isObjectEmpty = require('../utilities/is-object-empty');

module.exports = function (restify, server, models) {

  var controller = RuminationsController(models);

  /**
   * POST: Create a Rumination for the Consumer
   */
  server.post('/consumers/ruminations', function(req, res) {
    controller.create(req.headers, req.params, function(status, message, consumer, rumination) {
      if (status === 201) {
        res.header('x-api-key', req.headers['x-api-key']);
        if (rumination) {
          res.send(201, rumination.toResponse());
        } else {
          res.send(500, { 'error': 'Internal Server Error. The server encountered an unexpected condition.' });
        }
      } else {
        res.header('x-api-key', req.headers['x-api-key']);
        res.send(status, { 'error': message });
      }
    });
  });

  /**
   * PUT: Update a Rumination for the Consumer
   */
  server.put('/consumers/ruminations/:ruminationId', function(req, res) {
    controller.update(req.headers, req.params, function(status, message, consumer, rumination) {
      if (status === 201) {
        res.header('x-api-key', req.headers['x-api-key']);
        if (rumination) {
          res.header('Location', '/consumers/ruminations/'+rumination.id);
          res.send(201, rumination.toResponse());
        } else {
          res.send(500, { 'error': 'Internal Server Error. The server encountered an unexpected condition.' });
        }
      } else {
        res.header('x-api-key', req.headers['x-api-key']);
        res.send(status, { 'error': message });
      }
    });
  });

};
/**
 * The Ruminations Controller
 * @access public
 */
function RuminationsController(models) {
  /**
   * Store the controller object
   *
   * @param {Object}
   */
  var controller = new Object();

  /**
   * Create a new Consumer's Rumination
   *
   * @param  {Object}   headers  The headers passed to the API
   * @param  {Object}   params   The parameters passed to the API
   * @param  {Function} callback The method to callback when completed
   * @return {Void}
   *
   * @access public
   */
  controller.create = function(headers, params, callback) {
    if (!hasHeader(headers, 'x-api-key')) {
      callback(404, 'Not Found. The consumer could not be found on the server.', null, null);
    } else if ((isObjectEmpty(params)) || (isObjectEmpty(params.passage))) {
      callback(400, 'Bad Request. The data you provided is malformed or missing.', null, null);
    } else {
      models.Consumer.findOne({
        where: { apiKey: headers['x-api-key'] }
      }).then(function(consumer) {
        if (consumer) {
          var data = models.Rumination.parseRequest(params);
          consumer.createRumination(data)
          .then(function(rumination) {
            callback(201, 'The Rumination was created.', consumer, rumination);
          }, function(error) {
            callback(400, error.message, null, null);
          });
        } else {
          callback(404, 'Not Found. The consumer could not be found on the server.', null, null);
        }
      }, function() {
        callback(404, 'Not Found. The consumer could not be found on the server.', null, null);
      });
    }
  };

  /**
   * Update the Consumer's Rumination
   *
   * @param  {Object}   headers  The headers passed to the API
   * @param  {Object}   params   The parameters passed to the API
   * @param  {Function} callback The method to callback when completed
   * @return {Void}
   *
   * @access public
   */
  controller.update = function(headers, params, callback) {
    if (!params.ruminationId) {
      callback(404, 'Not Found. The rumination could not be found on the server.', null, null);
    } else if ((isObjectEmpty(params)) || (isObjectEmpty(params.passage))) {
      callback(400, 'Bad Request. The data you provided is malformed or missing.', null, null);
    } else if (!hasHeader(headers, 'x-api-key')) {
      callback(404, 'Not Found. The consumer could not be found on the server.', null, null);
    } else {
      models.Rumination.findOne({
        where: {id: params.ruminationId }
      }).then(function(rumination) {
        if (rumination) {
          models.Consumer.findOne({
            where: { apiKey: headers['x-api-key'] }
          }).then(function(consumer) {
            if (consumer) {
              /**
               * Update the Rumination
               */
              var data = models.Rumination.parseRequest(params);
              models.Rumination.update(data, {
                where: {id: params.ruminationId }
              }).then(function() {
                models.Rumination.findOne({
                  where: {id: params.ruminationId }
                }).then(function(rumination) {
                  callback(201, 'The Rumination has been updated.', consumer, rumination);
                }, function(error) {
                  callback(400, error.message, consumer, null);
                });
              }, function(error) {
                callback(400, error.message, consumer, null);
              });
            } else {
              callback(404, 'Not Found. The consumer could not be found on the server.', null, null);
            }
          }, function() {
            callback(404, 'Not Found. The consumer could not be found on the server.', null, null);
          });
        } else {
          callback(404, 'Not Found. The rumination could not be found on the server.', null, null);
        }
      }, function(error) {
        callback(400, error.message, null, null);
      });
    }
  };

  /**
   * Does the header exist and is set?
   *
   * @param  {Object}  headers The supplied headers
   * @param  {String}  key     The name of the expected header
   * @return {Boolean}         Does it exist, and is set to a value?
   * @access private
   */
  function hasHeader(headers, key) {
    return (_.has(headers, key))  && (headers[key] !== '');
  }

  return controller;
}
