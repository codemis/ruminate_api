'use strict';

/**
 * Include the underscore library
 * @param  {Object}
 */
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
  var Rumination = sequelize.define('Rumination', {
    passageVersion: DataTypes.STRING,
    passageSnippet: DataTypes.TEXT,
    firstBook: DataTypes.STRING,
    firstAbbreviation: DataTypes.STRING,
    firstChapter: DataTypes.INTEGER,
    firstVerse: DataTypes.INTEGER,
    lastBook: DataTypes.STRING,
    lastAbbreviation: DataTypes.STRING,
    lastChapter: DataTypes.INTEGER,
    lastVerse: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Rumination.belongsTo(models.Consumer);
        Rumination.hasMany(models.Response);
      },
      /**
       * Parse the request data to create the Rumination object
       *
       * @return {Object} JSON Object of the Rumination Data
       * @access public
       */
      parseRequest: function(data) {
        var request = {};
        if (_.has(data, 'passage')) {
          if (_.has(data.passage, 'version')) {
            request.passageVersion = data.passage.version;
          }
          if (_.has(data.passage, 'snippet')) {
            request.passageSnippet = data.passage.snippet;
          }
          if (_.has(data.passage, 'first')) {
            if (_.has(data.passage.first, 'book')) {
              request.firstBook = data.passage.first.book;
            }
            if (_.has(data.passage.first, 'abbreviation')) {
              request.firstAbbreviation = data.passage.first.abbreviation;
            }
            if (_.has(data.passage.first, 'chapter')) {
              request.firstChapter = data.passage.first.chapter;
            }
            if (_.has(data.passage.first, 'verse')) {
              request.firstVerse = data.passage.first.verse;
            }
          }
          if (_.has(data.passage, 'last')) {
            if (_.has(data.passage.last, 'book')) {
              request.lastBook = data.passage.last.book;
            }
            if (_.has(data.passage.last, 'abbreviation')) {
              request.lastAbbreviation = data.passage.last.abbreviation;
            }
            if (_.has(data.passage.last, 'chapter')) {
              request.lastChapter = data.passage.last.chapter;
            }
            if (_.has(data.passage.last, 'verse')) {
              request.lastVerse = data.passage.last.verse;
            }
          }
        }
        return request;
      },
      /**
       * Parse the sort order for ruminations
       *
       * @param  {Object} data  The request parameters
       * @return {Array}        The Sequelize sort array
       * @access public
       */
      parseSortOrder: function(data) {
        var order = ['createdAt', 'ASC'];
        var allowedFields = [
          'passageVersion',
          'passageSnippet',
          'firstBook',
          'firstAbbreviation',
          'firstChapter',
          'firstVerse',
          'lastBook',
          'lastAbbreviation',
          'lastChapter',
          'lastVerse',
          'createdAt',
          'updatedAt'
        ];
        if (
          (_.has(data, 'sortOrder')) &&
          (_.has(data.sortOrder, 'ruminations')) &&
          (_.has(data.sortOrder.ruminations, 'field')) &&
          (_.has(data.sortOrder.ruminations, 'direction'))
        ) {
            var field = data.sortOrder.ruminations.field;
            var direction = data.sortOrder.ruminations.direction.toUpperCase();
            if (_.indexOf(allowedFields, field) === -1) {
              throw new Error('Bad Request. The field you provided is not allowed.');
            } else if (_.indexOf(['ASC', 'DESC'], direction) === -1) {
              throw new Error('Bad Request. The direction you provided is not allowed.');
            } else {
              order = [field, direction];
            }
        }
        return order;
      }
    },
    instanceMethods: {
      /**
       * Return the reponse for a Rumination
       *
       * @return {Object} JSON Object of the Rumination Data
       * @access public
       */
      toResponse: function() {
        return {
          id: this.id,
          passage: {
            version:          this.passageVersion,
            snippet:          this.passageSnippet,
            first: {
              book:           this.firstBook,
              abbreviation:   this.firstAbbreviation,
              chapter:        this.firstChapter,
              verse:          this.firstVerse
            },
            last: {
              book:           this.lastBook,
              abbreviation:   this.lastAbbreviation,
              chapter:        this.lastChapter,
              verse:          this.lastVerse
            }
          },
          createdAt:    this.createdAt,
          updatedAt:    this.updatedAt
        };
      }
    }
  });
  return Rumination;
};
