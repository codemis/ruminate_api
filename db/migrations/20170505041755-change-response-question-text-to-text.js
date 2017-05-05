'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Responses',
      'questionContent',
      {
        type: Sequelize.TEXT
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Responses',
      'questionContent',
      {
        type: Sequelize.STRING
      }
    );
  }
};
