'use strict';

define([
  'handlebars',
	'backbone',
  'models/federal-countries-disclaimer',
  'text!../../layouts/federal-disclaimer.handlebars'
], function(Handlebars, Backbone, FederalCountriesDisclaimer, tpl){

	var FederalDisclaimer = Backbone.View.extend({

    model: FederalCountriesDisclaimer,
    template: Handlebars.compile(tpl),
    el: '#FederalDisclaimer',

    initialize: function() {
      var self = this;
      this.model.getMessage(function() {
        var data = self.model.toJSON();
        self.render(data);
      });
    },

    render: function(data) {
      this.$el.append(this.template({
        body: data[0].body
      }));
    }
	});

  //Aqui devuelvo un cosntructor (ver pillarScore)
	return FederalDisclaimer;

});
