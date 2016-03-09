'use strict';
/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Clients', [{
      name: 'Ruminate App',
      applicationId: randomstring.generate(),
      createdAt: 'NOW()',
      updatedAt: 'NOW()'
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Clients', null, {});
  }
};
