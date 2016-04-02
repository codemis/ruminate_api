'use strict';
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
      }
    }
  });
  return Rumination;
};
