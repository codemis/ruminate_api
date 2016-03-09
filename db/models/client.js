'use strict';
module.exports = function(sequelize, DataTypes) {
  var Client = sequelize.define('Client', {
    name: DataTypes.STRING,
    applicationId: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Client.hasMany(models.Consumer);
      }
    }
  });
  return Client;
};
