'use strict';
define(['backbone'], function(Backbone) {

  var CountryModel = Backbone.Model.extend({

    url: function() {
      return '/country-info/' + this.countryId;
    },

    parse: function(data) {
      return {
        name: (data[0].Name ? data[0].Name : '-'),
        description: data[0].Description ,
        population: (data[0].Population ? data[0].Population : '-'),
        gdp: (data[0].GDP ? data[0].GDP : '-'),
        grp: (data[0].GRP ? data[0].GRP : '-'),
        hdi: (data[0].HDI ? data[0].HDI : '-'),
        epi: (data[0].EPI ? data[0].EPI : '-'),
        'government-responses': data[0]['government-responses'],
        'doing-well': data[0]['doing-well'],
        recommendations: data[0].recommendations,
        data: data[0].data,
        'government-response-file': data[0]['government-response-file'],
        'reviewer': data[0]['national-reviewer'],
        'researcher': data[0]['national-researcher']
      };
    },

    getByCountryId: function(countryId, callback) {
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

  return new CountryModel ();

});
