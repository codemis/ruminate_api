'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Responses',
      'answer',
      {
        type: Sequelize.TEXT
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Responses',
      'answer',
      {
        type: Sequelize.STRING
      }
    );
  }
};
