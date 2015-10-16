'use strict';
define(['backbone'], function(Backbone){

  var NoUpdatedModel = Backbone.Model.extend({

    url: function() {
      return '/no-updated-info';
    },

    parse: function(data) {
      return data;
    },

    getMessage: function(callback) {
      var onError, onSuccess;

      onSuccess = function(model) {
        if (typeof callback === 'function' && callback) {
          return callback(void 0, model);
        }
      };
      onError = function(xhr, err) {
        if (typeof callback === 'function' && callback) {
          return callback(err);
        }
      };

      this.fetch({
        dataType: 'json',
        success: onSuccess,
        error: onError
      });
    }

  });

  return new NoUpdatedModel();

});
