'use strict';

define([
  'backbone',
  'models/country'
], function(Backbone, CountryModel) {

  var RouterCompare = Backbone.Router.extend({

    routes: {
      ':countryA/:countryB(/)': 'setCountries',
      ':countryA/:countryB/:countryC(/)': 'setCountries'
    },

    setCountries: function(countryA, countryB, countryC) {
      CountryModel.set({
        countryA: countryA,
        countryB: countryB,
      });

      if(countryC) {
        CountryModel.set({
          countryC: countryC
        });
      }
    }

  });

  return RouterCompare;

});
