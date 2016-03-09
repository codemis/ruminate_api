'use strict';
module.exports = function(sequelize, DataTypes) {
  var Clients = sequelize.define('Clients', {
    name: DataTypes.STRING,
    applicationId: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Clients;
};