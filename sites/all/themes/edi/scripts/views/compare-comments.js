'use strict';

define([
  'backbone',
  'handlebars',
  'text!../../layouts/compare-comments.handlebars'
], function(Backbone, Handlebars, tpl) {

  var CompareCommentsView = Backbone.View.extend({

    el: '#compare-comments',

    template: Handlebars.compile(tpl),

    initialize: function() {
      //this.render();
    },

    render: function() {
      this.$el.html(this.template);
    }

  });

  return CompareCommentsView;
});
