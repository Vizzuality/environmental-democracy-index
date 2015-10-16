'use strict';

define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var RankingScoresCollection = Backbone.Collection.extend({

    url: function() {
      return '/countries-by-guideline/' + this.guidelineId;
    },

    parse: function(data) {
      return _.map(data, function(d){
        return {
          guideline: d.guideline,
          'guideline-desc': d.description,
          country: d.name,
          field_iso: d.field_iso,
          rank: Number(d.rank),
          score: d.score,
          federal: d.federal
        };
      });
    },

    getScoresByGuideline: function(guidelineId, callback) {
      var onError, onSuccess;
      this.guidelineId = guidelineId;
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

      this.reset();

      return this.fetch({
        dataType: 'json',
        success: onSuccess,
        error: onError
      });
    }
  });
  return RankingScoresCollection;
});
