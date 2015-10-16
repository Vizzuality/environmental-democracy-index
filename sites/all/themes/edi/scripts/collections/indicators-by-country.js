'use strict';
define([
  'underscore',
  'backbone',
  'models/indicator'
], function(_, Backbone, IndicatorModel) {
  var IndicatorsByCountry;
  IndicatorsByCountry = Backbone.Model.extend({
    model: IndicatorModel,
    url: function() {
      return /indicators-by/ + this.countryId + '/' + this.pillarId + '/' + this.guidelineId + '/' + this.indicator;
    },

    parse: function(data) {

      //Data es todo lo que viene de la API cuando haces la llamada de url.
      var result = _.groupBy(_.map(data, function(d){
        d.indicatorNumber = Number(d['indicator-number']);
        d.indicatorText = d.indicator;
        d.score = (d.score === '-' ? '-'  : parseInt(d.score).toString());
        return d;
      }), function(d){
        return d.type;
      });

      return result;
    },

    getByCountry: function(countryId, pillarId, guidelineId, indicatorId, callback) {
      var onError, onSuccess;
      this.countryId = countryId;
      this.pillarId = pillarId;
      this.guidelineId = guidelineId;
      this.indicator = indicatorId;

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
  return IndicatorsByCountry;
});
