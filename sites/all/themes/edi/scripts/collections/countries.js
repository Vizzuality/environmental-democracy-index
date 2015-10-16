'use strict';

define(['underscore', 'backbone'], function(_, Backbone){
  var CountriesCollection = Backbone.Collection.extend({

    url: function() {
      return '/countries-with-pillar-score';
    },

    parse: function(data) {
      var result = _.sortBy(data, function(d){
        return d.name;
      });
      return result;
    },

    getCountries: function(callback) {
      var onError, onSuccess;

      onSuccess = function(collection) {
        if (typeof callback === 'function' && callback) {
          return callback(null, collection);
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
  return CountriesCollection;
});
