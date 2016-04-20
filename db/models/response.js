'use strict';
/**
 * Include the underscore library
 * @param  {Object}
 */
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
  var Response = sequelize.define('Response', {
    questionTheme: DataTypes.STRING,
    questionContent: DataTypes.STRING,
    answer: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Response.belongsTo(models.Rumination);
      },
      /**
       * Parse the request data to create the Response object
       *
       * @return {Object} JSON Object of the Response Data
       * @access public
       */
      parseRequest: function(data) {
        var request = {};

        if (_.has(data, 'answer')) {
          request.answer = data.answer;
        }

        return request;
      },
      /**
       * Parse the sort order for responses
       *
       * @param  {Object} data  The request parameters
       * @return {Array}        The Sequelize sort array
       * @access public
       */
      parseSortOrder: function(data) {
        var order = [Response, 'createdAt', 'ASC'];
        var allowedFields = [
          'questionTheme',
          'questionContent',
          'answer',
          'createdAt',
          'updatedAt'
        ];
        if (_.has(data, 'sort_responses')) {
          var sortData = data.sort_responses.split('|');
          if (sortData.length >= 2) {
            var field = sortData[0];
            var direction = sortData[1].toUpperCase();
            if (_.indexOf(allowedFields, field) === -1) {
              throw new Error('Bad Request. The field you provided is not allowed.');
            } else if (_.indexOf(['ASC', 'DESC'], direction) === -1) {
              throw new Error('Bad Request. The direction you provided is not allowed.');
            } else {
              order = [Response, field, direction];
            }
          }
        }
        return order;
      }
    },
    instanceMethods: {
      /**
       * Return the reponse for a Response
       *
       * @return {Object} JSON Object of the Response Data
       * @access public
       */
      toResponse: function() {
        return {
          id: this.id,
          question: {
            theme: this.questionTheme,
            content: this.questionContent
          },
          answer: this.answer,
          createdAt:    this.createdAt,
          updatedAt:    this.updatedAt
        };
      }
    }
  });
  return Response;
};
