'use strict';

define([
	'backbone',
  'handlebars',
  'models/no-updated-info-collection',
  'text!../../layouts/updated-disclaimer.handlebars'
], function(Backbone, Handlebars, NoUpdatedModel, tpl){

	var UpdatedInfoView = Backbone.View.extend({

		el: 'body',
    model: NoUpdatedModel,
    template: Handlebars.compile(tpl),

		events: {
      'click .disclaimer-close' : 'closePopup',
      'click .close' : 'closePopup'
		},

		initialize: function() {
      var showed = this.getShowed();

      if (!showed) {
        var self = this;
        this.model.getMessage(function() {
          var data = self.model.toJSON();
          self.render(data);
        });
      } else {
        return;
      }
    },

    closePopup: function(e){
      e.preventDefault();
      this.$('.mod-disclaimer').fadeOut();
      this.$('.mod-disclaimer').remove();
    },

    render: function(data) {
      this.$el.append(this.template({
        body: data[0].body,
        title: data[0].title
      }));

      this.setShowed();
    },

    setShowed: function() {
      var showed = true;
      sessionStorage.setItem('showedDisclaimer', showed);
    },

    getShowed: function() {
      return sessionStorage.getItem('showedDisclaimer');
    }

  });

  return UpdatedInfoView;

});
