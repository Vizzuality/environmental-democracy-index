'use strict';

define(['backbone'], function(Backbone){
  var GenericDataFile = Backbone.Model.extend({

    url: function() {
      return '/generic-country-data';
    },

    parse: function(data) {
      return data;
    },

    getGenericFile: function(callback) {
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

      return this.fetch({
        dataType: 'json',
        success: onSuccess,
        error: onError
      });
    }
  });
  return new GenericDataFile();
});
