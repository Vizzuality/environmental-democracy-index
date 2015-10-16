'use strict';

define([
	'backbone',
	'handlebars',
  'underscore',
	'models/blogModel',
	'text!../../layouts/blog-index.handlebars'
], function(Backbone, Handlebars, _, blogIndexModel, tpl){

	var BlogIndexView = Backbone.View.extend({

		el: '#blogIndexView',
		model: blogIndexModel,
		template: Handlebars.compile(tpl),

		initialize: function() {
      var self = this;
      var blogData;

      this.model.getBlogIndex(function() {
        blogData = self.model.toJSON();
        self.render(blogData);
      });
		},

		render: function(blogData) {
      blogData = {list: blogData};
			this.$el.append(this.template(blogData));
		}
	});

	return BlogIndexView;

});
