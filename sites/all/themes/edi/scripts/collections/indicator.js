'use strict';

define(['underscore', 'backbone', 'models/indicator'], function(_, Backbone, IndicatorModel) {

  var GuidelinesCollections = Backbone.Model.extend({

    model: IndicatorModel,

    url: function() {
      return '/indicators-by-pillar-and-guideline/' + this.currentPillarId + '/' + this.currentGuidelineId;
    },

    parse: function(data){

      var result = _.groupBy(_.map(data, function(d){
        return d;
      }), function(d) {
        return d.type;
      });

      return result;
    },

    getByGuideline: function(pillarId, guidelineId, callback) {
      var onError, onSuccess;
      this.currentPillarId = pillarId;
      this.currentGuidelineId = guidelineId;

      onSuccess = function(collection) {
        if (typeof callback === 'function' && callback) {
          return callback(void 0, collection);
        }
      };

      onError = function(xhr, err) {
        if (typeof callback === 'function' && callback) {
          return callback(err);
        }
      };

      this.clear();

      return this.fetch({
        dataType: 'json',
        success: onSuccess,
        error: onError
      });
    }
  });

  return GuidelinesCollections;

});
