'use strict';
define(['backbone'], function(Backbone){

  var InPracticeScoreModel = Backbone.Model.extend({

    url: function() {
      return /in-practice/ + this.countryId;
    },

    parse: function(data) {
      return data;
    },

    getPracticeIndicatorScore: function(countryId, callback) {
      var onError, onSuccess;
      this.countryId = countryId;

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

  return new InPracticeScoreModel();

});
