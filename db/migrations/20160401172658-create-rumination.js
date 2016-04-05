'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Ruminations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ConsumerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Consumers',
          key: 'id'
        }
      },
      passageVersion: {
        type: Sequelize.STRING
      },
      passageSnippet: {
        type: Sequelize.TEXT
      },
      firstBook: {
        type: Sequelize.STRING
      },
      firstAbbreviation: {
        type: Sequelize.STRING
      },
      firstChapter: {
        type: Sequelize.INTEGER
      },
      firstVerse: {
        type: Sequelize.INTEGER
      },
      lastBook: {
        type: Sequelize.STRING
      },
      lastAbbreviation: {
        type: Sequelize.STRING
      },
      lastChapter: {
        type: Sequelize.INTEGER
      },
      lastVerse: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Ruminations');
  }
};
