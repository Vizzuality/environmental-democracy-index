'use strict';

define([
	'backbone'
], function(Backbone){

	var AboutView = Backbone.View.extend({

		el: '#about-edi',

		events: {
			'click .anchor' : 'setScroll'
		},

		setScroll: function(ev) {
			var target = $(ev.currentTarget).attr('data');

      var scroll = $(window).width() < 640 ? $(target).offset().top - 60 : $(target).offset().top - 30;

			$('html, body').animate({
	    		scrollTop: scroll
	  		}, 300);

			ev.preventDefault();
		}

	});

	return AboutView;

});
