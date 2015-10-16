'use strict';

define([
  'backbone',
  'handlebars',
  'models/federal-countries-disclaimer',
  'text!../../layouts/definition-overlay.handlebars'
], function(Backbone, Handlebars, FederalCountriesDisclaimer, tpl){

  var DefinitionOverlay = Backbone.View.extend({

    el: 'body',

    template: Handlebars.compile(tpl),
    model: FederalCountriesDisclaimer,

    events: {
      'touchstart .close' : 'closePopup',
      'touchstart .overlay-bg' : 'closePopup',

      'click .close' : 'closePopup',
      'click .overlay-bg' : 'closePopup'
    },

    initialize: function(obj) {
      this.federal = obj.federal ? true : false;

      if (this.federal) {
        this.getFederalData();
      }
    },

    closePopup: function(){
      $('#overlay').remove();
      $('body, html').removeClass('is-overflow-hidden');
    },

    getFederalData: function() {
      var self = this;

      this.model.getMessage(function() {
        var data = self.model.toJSON();
        self.render(data);
      });
    },

    render: function(data) {
      this.$el.append(this.template({
        title: data[0].title,
        body: data[0].body
      }));

      $('body, html').addClass('is-overflow-hidden');
    }

  });

  return DefinitionOverlay;

});
