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
      }
    }
  });
  return Response;
};
