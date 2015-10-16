'use strict';

define([
  'jquery',
	'backbone',
  'handlebars',
  'text!../../layouts/tutorial-overlay.handlebars'
], function($, Backbone, Handlebars, tpl){

	var TutorialOverlayView = Backbone.View.extend({

		el: '#overlay-tutorial',

    template: Handlebars.compile(tpl),

		events: {
			'click' : 'closePopup'
		},

    initialize: function () {
      this._setListener();
    },

    _setListener: function () {
      Backbone.Events.on('openTutorial', this.render, this);
    },

		closePopup: function(){
      $('#overlay').remove();
      $('body, html').removeClass('is-overflow-hidden');
    },

    render: function () {
      this.$el.html(this.template());
      $('body, html').addClass('is-overflow-hidden');
    }

	});

	return TutorialOverlayView;

});
