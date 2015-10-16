'use strict';
define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var GuidelinesByCountryCollection = Backbone.Collection.extend({

    url: function() {
      return /guideline-by-country/ + this.countryId + '/' +this.pillarId;
    },

    parse: function(data) {
      var result =  _.sortBy(_.map(data, function(d){
        return {
          guideline: d.guideline,
          number: Number(d.number),
          score: (d.score === '-' ? '-' : d.score)
        };
      }), function(d) {
        return d.number;
      });

      return result;
    },

    getByPillar: function(countryId, pillarId, callback) {
      var onError, onSuccess;

      this.pillarId = pillarId;
      this.countryId = countryId;

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

  return GuidelinesByCountryCollection;
});
