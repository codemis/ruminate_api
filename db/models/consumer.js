'use strict';
module.exports = function(sequelize, DataTypes) {
  var Consumer = sequelize.define('Consumer', {
    apiKey: DataTypes.TEXT,
    deviceModel: DataTypes.STRING,
    devicePlatform: DataTypes.STRING,
    deviceVersion: DataTypes.STRING,
    deviceUUID: DataTypes.TEXT,
    pushInterval: DataTypes.INTEGER,
    pushToken: DataTypes.TEXT,
    pushReceive: DataTypes.BOOLEAN,
    pushTimezone: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Consumer;
};
