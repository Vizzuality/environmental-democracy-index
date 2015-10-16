'use strict';

define([
  'underscore',
  'backbone',
  'presenter',
  'handlebars',
  'collections/guidelines',
  'text!../../layouts/guideline-overlay.handlebars'
], function(_, Backbone, presenter, Handlebars, GuidelineCollection, tpl) {

  var GuidelineOverlay = Backbone.View.extend({

    el: 'body',
    template: Handlebars.compile(tpl),
    collection: new GuidelineCollection(),

    events: {
      'touchstart .close' : 'closePopup',
      'touchstart .overlay-bg' : 'closePopup',

      'click .close' : 'closePopup',
      'click .overlay-bg' : 'closePopup'
    },

    closePopup: function(){
      $('#overlay').remove();
      $('body, html').removeClass('is-overflow-hidden');
    },

    setData: function(guideline) {
      var self = this;
      var currentPillar = presenter.get('pillar') || 'all';

      if($('#overlay')) {
        $('#overlay').remove();
      }

      this.currentGuideline = presenter.get('guideline') || guideline;

      this.collection.getByPillar(currentPillar, function() {
        self.data = _.findWhere(self.collection.toJSON(), {id: parseInt(self.currentGuideline)});
        self.render();
      });
    },

    render: function() {
      this.$el.append(this.template({
        guideline: this.currentGuideline,
        title: this.data.name,
        description: this.data.description
      }));

      $('body, html').addClass('is-overflow-hidden');
    }

  });

  return new GuidelineOverlay();

});
