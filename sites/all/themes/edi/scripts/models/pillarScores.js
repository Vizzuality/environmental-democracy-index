'use strict';
define(['backbone'], function(Backbone){

  var PillarScoreModel = Backbone.Model.extend({

    url: function() {
      return '/pillar-by-country/' + this.countryId;
    },

    parse: function(data) {

      return {
              'score-1': (data[0] ? data[0].score : '-'),
              'score-2': (data[1] ? data[1].score : '-'),
              'score-3': (data[2] ? data[2].score : '-')
            };
    },

    getPillarScore: function(countryId, callback) {
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
  // Aqui devuelvo una instancia (ver federal disclaimer)
  // cada vez que use este modelo, será la misma instancia.
  // Y todos los cambios se replicarán en todos los lados donde se esté
  // usando
  return new PillarScoreModel();
});
