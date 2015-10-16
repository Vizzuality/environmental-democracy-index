'use strict';

define([
  'backbone'
], function(Backbone){

  var PillarScoreCollection = Backbone.Model.extend({

    url: function() {
      return 'countries-by-pillar/' + this.pillarId;
    },

    getPillarScores: function(pillarId, callback) {
      var onError, onSuccess;
      this.pillarId = pillarId;
      onSuccess = function(collection) {
        if (typeof callback === 'function' && callback) {
          return callback(undefined, collection);
        }
      };
      onError = function(xhr, err) {
        if (typeof callback === 'function' && callback) {
          return callback(err);
        }
      };

      this.clear();

      this.fetch({
        dataType: 'json',
        success: onSuccess,
        error: onError
      });
    }
  });

  return PillarScoreCollection;
});
