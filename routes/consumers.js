/**
 * Consumers Routes
 */
'use strict';

module.exports = function (restify, server, models) {

  server.post('/consumers/register', function(req, res) {
    var clientId = req.headers['x-client-id'];
    var consumerData = models.Consumer.parseRequest(req.params);
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
      }
    });
  });

};
