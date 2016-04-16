'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Responses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RuminationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ruminations',
          key: 'id'
        }
      },
      questionTheme: {
        type: Sequelize.STRING
      },
      questionContent: {
        type: Sequelize.STRING
      },
      answer: {
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
    return queryInterface.dropTable('Responses');
  }
};
