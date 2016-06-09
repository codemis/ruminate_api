'use strict';
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define('Task', {
    deliverOn: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Task.belongsTo(models.Task);
      }
    }
  });
  return Task;
};
