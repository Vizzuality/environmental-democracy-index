'use strict';

define([
  'backbone'
], function(Backbone) {

  var OverallScoresCollection = Backbone.Model.extend({

    url: function() {
      return 'countries-by-overall/';
    },

    getOverallScore: function(callback) {
      var onError, onSuccess;
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

  return OverallScoresCollection;
  
});
