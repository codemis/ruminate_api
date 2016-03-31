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
      ClientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id'
        }
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
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      pushTimezone: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Consumers');
  }
};
