'use strict';

define([
	'backbone',
	'handlebars',
  'underscore',
	'models/tagLineModel',
	'text!../../layouts/tag-line.handlebars'
], function(Backbone, Handlebars, _, tagLineModel, tpl){

	var TagLineView = Backbone.View.extend({

		el: '#tagLine',
		model: tagLineModel,
		template: Handlebars.compile(tpl),

		initialize: function() {
      var self = this;
      var tagLine;

      this.model.gettagLine(function() {
        tagLine = self.model.toJSON();
        self.render(tagLine);
      });
		},

		render: function(tagLine) {
			this.$el.html(this.template(tagLine[0]));
		}
	});

	return TagLineView;

});
