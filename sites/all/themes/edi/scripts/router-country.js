'use strict';
define([
  'backbone',
  'models/country'
], function(Backbone, CountryModel) {

  var RouterCountry = Backbone.Router.extend({

    routes: {
      'country/:iso(/)' : 'getISO'
    },

    getISO: function(iso) {
      CountryModel.set({
        iso: iso
      });

      Backbone.Events.trigger('setISO', CountryModel.toJSON());
    }
  });

  return RouterCountry;

});
