'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Consumers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      apiKey: {
        type: Sequelize.TEXT
      },
      deviceModel: {
        type: Sequelize.STRING
      },
      devicePlatform: {
        type: Sequelize.STRING
      },
      deviceVersion: {
        type: Sequelize.STRING
      },
      deviceUUID: {
        type: Sequelize.TEXT
      },
      pushInterval: {
        type: Sequelize.INTEGER
      },
      pushToken: {
        type: Sequelize.TEXT
      },
      pushReceive: {
        type: Sequelize.BOOLEAN
      },
      pushTimezone: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Consumers');
  }
};
