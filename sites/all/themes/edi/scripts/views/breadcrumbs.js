'use strict';

define([
	'backbone',
	'handlebars',
	'models/country',
	'text!../../layouts/breadcrumbs-country.handlebars'
], function(Backbone, Handlebars, CountryModel, tpl){

	var BreadcrumbsView = Backbone.View.extend({

		el: '#breadcrumbs',
		model: CountryModel,
		template: Handlebars.compile(tpl),

		initialize: function() {
			//this.render();
		},

		render: function() {
			this.$el.html(this.template({
				route: CountryModel.get('name')
			}));
		}

	});

	return BreadcrumbsView;

});
