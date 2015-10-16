'use strict';

define([
  'backbone',
  'handlebars',
  'collections/indicator',
  'views/indicator-type-overlay',
  'text!../../layouts/about-index-indicators.handlebars'
], function(Backbone, Handlebars, IndicatorsList, IndicatorTypeOverlay, tpl){

  var IndicatorsIndexView = Backbone.View.extend({

    el: '.indicators',

    template: Handlebars.compile(tpl),

    collection: new IndicatorsList(),

    events: {
      'click .more-info-type-indicator': 'setIndicatorTypeOverlay'
    },

    initialize: function() {
      this.guidelineId;
    },

    getIndicators: function(pillarId, guidelineId) {
      this.guidelineId = guidelineId;
      this.el = '#guideline-' + this.guidelineId;
      this.setElement(this.el);


      $('.guidelines a').unbind('click');
      this.$el.find('.indicators').remove();

      if(!(this.$el.hasClass('is-open'))) {
        this.$el.addClass('is-open');

        this.showIndicators(pillarId, this.guidelineId);
      } else {
        this.$el.removeClass('is-open');
      }
    },

    showIndicators: function(pillarId, guidelineId) {
      var self = this;

      this.$el.parent().addClass('csspinner');

      this.collection.getByGuideline(pillarId, guidelineId, function(){
        self.render();
      });
    },

    setIndicatorTypeOverlay: function(evt) {
      evt.preventDefault();

      var type = $(evt.currentTarget).attr('data-type');
      IndicatorTypeOverlay.render(type);
    },

    render: function() {
      var indicators,
          indicatorsLaw,
          indicatorsPractice;

      indicators = this.collection.toJSON();
      indicatorsLaw = indicators.Law || null;
      indicatorsPractice = indicators.Practice || null;

      this.$el.append(this.template({
        indicatorsLaw : indicatorsLaw,
        indicatorsPractice : indicatorsPractice
      }));

      this.$el.parent().removeClass('csspinner');
    }
  });

  return IndicatorsIndexView;

});
