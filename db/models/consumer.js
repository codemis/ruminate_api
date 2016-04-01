'use strict';

/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');
/**
 * Include the underscore library
 * @param  {Object}
 */
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
  var Consumer = sequelize.define('Consumer',
  {
    apiKey: DataTypes.TEXT,
    deviceModel: DataTypes.STRING,
    devicePlatform: DataTypes.STRING,
    deviceVersion: DataTypes.STRING,
    deviceUUID: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The device.uuid is missing in the consumer object.'
        }
      }
    },
    pushInterval: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pushToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The push.token is missing in the consumer object.'
        }
      }
    },
    pushReceive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    pushTimezone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The push.timezone is missing in the consumer object.'
        }
      }
    }
  },
  {
    validate: {
      intervalGreaterThanZero: function() {
        if ((this.pushInterval === '') || (this.pushInterval <= 0)) {
          throw new Error('The push.interval is missing or set to zero in the consumer object.');
        }
      }
    },
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
        var request = {};
        if (_.has(data, 'device')) {
          if (_.has(data.device, 'model')) {
            request.deviceModel = data.device.model;
          }
          if (_.has(data.device, 'platform')) {
            request.devicePlatform = data.device.platform;
          }
          if (_.has(data.device, 'version')) {
            request.deviceVersion = data.device.version;
          }
          if (_.has(data.device, 'uuid')) {
            request.deviceUUID = data.device.uuid;
          }
        }
        if (_.has(data, 'push')) {
          if (_.has(data.push, 'interval')) {
            request.pushInterval = data.push.interval;
          }
          if (_.has(data.push, 'token')) {
            request.pushToken = data.push.token;
          }
          if (_.has(data.push, 'receive')) {
            request.pushReceive = data.push.receive;
          }
          if (_.has(data.push, 'timezone')) {
            request.pushTimezone = data.push.timezone;
          }
        }
        return request;
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
