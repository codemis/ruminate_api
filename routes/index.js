/**
 * Load all the route files.
 *
 */
'use strict';
var fs = require('fs');

module.exports = function (restify, server) {
  fs.readdirSync('./routes').forEach(function (file) {
    if (file.substr(-3, 3) === '.js' && file !== 'index.js') {
      require('./' + file.replace('.js', ''))(restify, server);
    }
  });
};
