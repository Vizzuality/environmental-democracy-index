'use strict';
define(['backbone'], function(Backbone){

  var OverallScoreModel = Backbone.Model.extend({

    url: function() {
      return /overall-by-country/ + this.countryId;
    },

    parse: function(data) {
      return { score : (data[0] ? data[0].score : '-')};
    },

    getOverallScore: function(countryId, callback) {
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

  return new OverallScoreModel();

});
