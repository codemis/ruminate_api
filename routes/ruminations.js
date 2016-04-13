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
   * GET: Get all Ruminations for a consumer
   */
  server.get('/consumers/ruminations', function(req, res) {
    controller.index(req.headers, req.params, JSON.parse(req.body), function(status, message, consumer, ruminations) {
      if (status === 200) {
        res.header('x-api-key', req.headers['x-api-key']);
        if (ruminations) {
          var data = [];
          for (var i = 0; i < ruminations.length; i++) {
            data.push(ruminations[i].toResponse());
          }
          res.send(status, data);
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
   * GET: Get an individual rumination
   */
  server.get('/consumers/ruminations/:ruminationId', function(req, res) {
    controller.show(req.headers, req.params, function(status, message, consumer, rumination) {
      if (status === 200) {
        res.header('x-api-key', req.headers['x-api-key']);
        if (rumination) {
          res.header('location', '/consumers/ruminations/'+rumination.id);
          res.send(status, rumination.toResponse());
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
   * POST: Create a Rumination for the Consumer
   */
  server.post('/consumers/ruminations', function(req, res) {
    controller.create(req.headers, req.params, function(status, message, consumer, rumination) {
      if (status === 201) {
        res.header('x-api-key', req.headers['x-api-key']);
        if (rumination) {
          res.header('location', '/consumers/ruminations/'+rumination.id);
          res.send(status, rumination.toResponse());
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
      if (status === 200) {
        res.header('x-api-key', req.headers['x-api-key']);
        if (rumination) {
          res.header('location', '/consumers/ruminations/'+rumination.id);
          res.send(status, rumination.toResponse());
        } else {
          res.send(500, { 'error': 'Internal Server Error. The server encountered an unexpected condition.' });
        }
      } else {
        res.header('x-api-key', req.headers['x-api-key']);
        res.send(status, { 'error': message });
      }
    });
  });

  server.del('/consumers/ruminations/:ruminationId', function(req, res) {
    controller.delete(req.headers, req.params, function(status, message) {
      res.header('x-api-key', req.headers['x-api-key']);
      if (status === 204) {
        res.send(status, '');
      } else {
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
   * Find all Ruminations for a Consumer
   *
   * @param  {Object}   headers  The headers passed to the API
   * @param  {Object}   params   The parameters passed to the API
   * @param  {Object}   body     The body data passed to the API
   * @param  {Function} callback The method to callback when completed
   * @return {Void}
   *
   * @access public
   */
  controller.index = function(headers, params, body, callback) {
    var orderError = false;
    var errorMessage = '';
    try {
      var order = models.Rumination.parseSortOrder(body);
    } catch (error) {
      orderError = true;
      errorMessage = error.message;
    }
    if (!hasHeader(headers, 'x-api-key')) {
      callback(404, 'Not Found. The consumer could not be found on the server.', null, null);
    } else if (orderError) {
      callback(400, errorMessage, null, null);
    } else {
      models.Consumer.findOne({
        where: { apiKey: headers['x-api-key'] }
      }).then(function(consumer) {
        if (consumer) {
          models.Rumination.findAll({
            where: {
              ConsumerId: consumer.id
            },
            order: [
              order
            ]
          }).then(function(ruminations) {
            callback(200, 'Found the ruminations.', consumer, ruminations);
          }, function(error) {
            callback(400, error.message, consumer, null);
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
   * Find a Rumination
   *
   * @param  {Object}   headers  The headers passed to the API
   * @param  {Object}   params   The parameters passed to the API
   * @param  {Function} callback The method to callback when completed
   * @return {Void}
   *
   * @access public
   */
  controller.show = function(headers, params, callback) {
    if (!params.ruminationId) {
      callback(404, 'Not Found. The rumination could not be found on the server.', null, null);
    } else if (!hasHeader(headers, 'x-api-key')) {
      callback(404, 'Not Found. The consumer could not be found on the server.', null, null);
    } else {
      models.Consumer.findOne({
        where: { apiKey: headers['x-api-key'] }
      }).then(function(consumer) {
        if (consumer) {
          models.Rumination.findOne({
            where: {
              id: params.ruminationId,
              ConsumerId: consumer.id
            }
          }).then(function(rumination) {
            if (rumination) {
              callback(200, 'Found the Rumination.', consumer, rumination);
            } else {
              callback(404, 'Not Found. The rumination could not be found on the server.', null, null);
            }
          }, function(error) {
            callback(400, error.message, consumer, null);
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
      models.Rumination.findById(params.ruminationId)
      .then(function(rumination) {
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
                where: {
                  id: params.ruminationId,
                  ConsumerId: consumer.id
                }
              }).then(function() {
                models.Rumination.findOne({
                  where: {id: params.ruminationId }
                }).then(function(rumination) {
                  callback(200, 'The Rumination has been updated.', consumer, rumination);
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
   * Delete the Consumer's Rumination
   *
   * @param  {Object}   headers  The headers passed to the API
   * @param  {Object}   params   The parameters passed to the API
   * @param  {Function} callback The method to callback when completed
   * @return {Void}
   *
   * @access public
   */
  controller.delete = function(headers, params, callback) {
    if (!params.ruminationId) {
      callback(404, 'Not Found. The rumination could not be found on the server.');
    } else if (!hasHeader(headers, 'x-api-key')) {
      callback(404, 'Not Found. The consumer could not be found on the server.');
    } else {
      models.Rumination.findById(params.ruminationId)
      .then(function(rumination) {
        if (rumination) {
          models.Consumer.findOne({
            where: { apiKey: headers['x-api-key'] }
          }).then(function(consumer) {
            if (consumer) {
              models.Rumination.destroy({
                where: {
                  id: params.ruminationId,
                  ConsumerId: consumer.id
                }
              }).then(function() {
                callback(204, '');
              }, function(error) {
                callback(400, error.message);
              });
            } else {
              callback(404, 'Not Found. The consumer could not be found on the server.');
            }
          }, function() {
            callback(404, 'Not Found. The consumer could not be found on the server.');
          });
        } else {
          callback(404, 'Not Found. The rumination could not be found on the server.');
        }
      }, function(error) {
        callback(400, error.message);
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
