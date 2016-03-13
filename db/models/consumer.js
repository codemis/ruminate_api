'use strict';

/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');

module.exports = function(sequelize, DataTypes) {
  var Consumer = sequelize.define('Consumer',
  {
    apiKey: DataTypes.TEXT,
    deviceModel: DataTypes.STRING,
    devicePlatform: DataTypes.STRING,
    deviceVersion: DataTypes.STRING,
    deviceUUID: DataTypes.TEXT,
    pushInterval: DataTypes.INTEGER,
    pushToken: DataTypes.TEXT,
    pushReceive: DataTypes.BOOLEAN,
    pushTimezone: DataTypes.STRING
  },
  {
    classMethods: {
      associate: function(models) {
        Consumer.belongsTo(models.Client);
      },
      /**
       * Parse the request data to create the Consumer object
       *
       * @return {Object} JSON Object of the Consumer Data
       * @access public
       */
      parseRequest: function(data) {
        return {
          deviceModel:      data.device.model,
          devicePlatform:   data.device.platform,
          deviceVersion:    data.device.version,
          deviceUUID:       data.device.uuid,
          pushInterval:     data.push.interval,
          pushToken:        data.push.token,
          pushReceive:      data.push.receive,
          pushTimezone:     data.push.timezone
        };
      }
    },
    instanceMethods: {
      /**
       * Return the reponse for a Consumer
       *
       * @return {Object} JSON Object of the Consumer Data
       * @access public
       */
      toResponse: function() {
        return {
          device: {
            model:      this.deviceModel,
            platform:   this.devicePlatform,
            version:    this.deviceVersion,
            uuid:       this.deviceUUID
          },
          push: {
            interval:   this.pushInterval,
            token:      this.pushToken,
            receive:    this.pushReceive,
            timezone:   this.pushTimezone
          },
          createdAt:    this.createdAt,
          updatedAt:    this.updatedAt
        };
      }
    }
  });
  /**
   * Add an API key to the new consumer
   */
  Consumer.hook('beforeCreate', function(consumer) {
    consumer.apiKey = randomstring.generate();
  });

  return Consumer;
};
