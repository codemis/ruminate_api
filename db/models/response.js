'use strict';
module.exports = function(sequelize, DataTypes) {
  var Response = sequelize.define('Response', {
    questionTheme: DataTypes.STRING,
    questionContent: DataTypes.STRING,
    answer: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Response.belongsTo(models.Rumination);
      }
    }
  });
  return Response;
};
