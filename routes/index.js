/**
 * Load all the route files.
 *
 */
'use strict';

/*eslint global-require: 0*/
module.exports = function (fs, restify, server, models) {
  fs.readdirSync('./routes').forEach(function (file) {
    if (file.substr(-3, 3) === '.js' && file !== 'index.js') {
      require('./' + file.replace('.js', ''))(restify, server, models);
    }
  });
};
