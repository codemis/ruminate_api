/**
 * Responses Routes
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

  var controller = ResponsesController(models);

  /**
   * PUT: Update a Response for the Rumination
   */
  server.put('/consumers/ruminations/:ruminationId/responses/:responseId', function(req, res) {
    controller.update(req.headers, req.params, function(status, message, consumer, rumination, response) {
      if (status === 200) {
        res.header('x-api-key', req.headers['x-api-key']);
        if (response) {
          res.send(status, response.toResponse());
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
 * The Responses Controller
 * @access public
 */
function ResponsesController(models) {
  /**
   * Store the controller object
   *
   * @param {Object}
   */
  var controller = new Object();

  /**
   * Update the Rumination's Response
   *
   * @param  {Object}   headers  The headers passed to the API
   * @param  {Object}   params   The parameters passed to the API
   * @param  {Function} callback The method to callback when completed
   * @return {Void}
   *
   * @access public
   */
  controller.update = function(headers, params, callback) {
    if (!hasHeader(headers, 'x-api-key')) {
      callback(404, 'Not Found. The consumer could not be found on the server.', null, null, null);
    } else if (!params.ruminationId) {
      callback(404, 'Not Found. The rumination could not be found on the server.', null, null, null);
    } else if (!params.responseId) {
      callback(404, 'Not Found. The response could not be found on the server.', null, null, null);
    } else if ((isObjectEmpty(params)) || (isObjectEmpty(params.answer))) {
      callback(400, 'Bad Request. The data you provided is malformed or missing.', null, null, null);
    } else {
      models.Response.findById(params.responseId)
      .then(function(response) {
        if (response) {
          models.Consumer.findOne({
            where: { apiKey: headers['x-api-key'] }
          }).then(function(consumer) {
            if (consumer) {
              models.Rumination.findById(params.ruminationId)
              .then(function(rumination) {
                if (rumination) {
                  var data = models.Response.parseRequest(params);
                  models.Response.update(data, {
                    where: {
                      id: params.responseId,
                      RuminationId: params.ruminationId
                    }
                  }).then(function() {
                    models.Response.findById(params.responseId)
                    .then(function(response) {
                      callback(200, 'The Response has been updated.', consumer, rumination, response);
                    }, function(error) {
                      callback(400, error.message, consumer, rumination, null);
                    });
                  }, function(error) {
                    callback(400, error.message, consumer, rumination, null);
                  });
                } else {
                  callback(404, 'Not Found. The rumination could not be found on the server.', null, null, null);
                }
              }, function() {
                callback(404, 'Not Found. The rumination could not be found on the server.', null, null, null);
              });
            } else {
              callback(404, 'Not Found. The consumer could not be found on the server.', null, null, null);
            }
          }, function() {
            callback(404, 'Not Found. The consumer could not be found on the server.', null, null, null);
          });
        } else {
          callback(404, 'Not Found. The response could not be found on the server.', null, null, null);
        }
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
