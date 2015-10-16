'use strict';

define([
  'underscore',
  'backbone',
  'presenter',
  'handlebars',
  'collections/indicator',
  'text!../../layouts/indicator-overlay.handlebars'
], function(_, Backbone, presenter, Handlebars, IndicatorCollection, tpl){

  var IndicatorOverlay = Backbone.View.extend({

    el: 'body',

    template: Handlebars.compile(tpl),

    collection: new IndicatorCollection(),

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

    setData: function(indicatorNumber, indicatorType, guideline) {
      var self = this;
      var currentPillar = 'all';

      if($('#overlay')) {
        $('#overlay').remove();
      }

      this.currentGuideline = guideline;

      this.collection.getByGuideline(currentPillar, this.currentGuideline, function() {

        _.map(self.collection.toJSON(), function(indicator){
          _.each(indicator, function(d){
            if(parseInt(d.Number) === indicatorNumber && d.type === indicatorType) {
              self.data = d;
            }
          });
        });

        self.render();
      });
    },

    render: function() {
      this.$el.append(this.template({
        guideline: this.currentGuideline,
        id: this.data.Number,
        question: this.data.Question,
        description: this.data.description,
      }));

      $('body, html').addClass('is-overflow-hidden');
    }

  });

  return new IndicatorOverlay();

});
