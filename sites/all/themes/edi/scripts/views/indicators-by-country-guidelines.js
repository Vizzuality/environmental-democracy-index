'use strict';

define([
  'backbone',
  'underscore',
  'handlebars',
  'models/country',
  'collections/indicators-by-country',
  'views/indicator-type-overlay',
  'text!../../layouts/indicators-score-country.handlebars',
  'text!../../layouts/indicator-info-overlay.handlebars',
], function(Backbone, _, Handlebars, CountryModel, IndicatorsByCountry, IndicatorTypeOverlay, tpl, tplOverlay){

  var IndicatorsByCountryGuidelines = Backbone.View.extend({

    template: Handlebars.compile(tpl),
    templateOverlay: Handlebars.compile(tplOverlay),
    collection: new IndicatorsByCountry(),

    events: {
      'click .more-info-type-indicator': 'setIndicatorTypeOverlay',
      'click .more-info-btn': 'showPopUp'
    },

    initialize: function() {
      _.bind(this.showPopUp, this);
    },

    getIndicators: function(countryId, pillarId, guidelineId) {

      this.guidelineId = guidelineId;
      this.el = '#guideline-' + this.guidelineId;
      this.setElement(this.el);
      this.countryId = countryId;
      this.pillarId = pillarId;

      $('.guidelines a').unbind('click');
      this.$el.find('.indicators').remove();

      if(!(this.$el.hasClass('is-open'))) {
          this.$el.addClass('is-open');
          this.showIndicators(countryId, pillarId,this.guidelineId);
      } else {
        this.$el.removeClass('is-open');
      }
    },

    showIndicators: function(countryId, pillarId, guidelineId) {
      var self = this;

      $('body').addClass('csspinner');

      var indicatorId = '';

      this.collection.getByCountry(countryId, pillarId, guidelineId, indicatorId, function(){
        self.render();
      });
    },

    setPracticeIndicators: function(practiceCollection) {
      _.each(practiceCollection, function(indicator) {

        if (indicator.score === '1') {
          indicator.score = 'limited';
        } else if (indicator.score === '2') {
          indicator.score = 'yes';
        } else {
          indicator.score = 'no';
        }
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

      this.setPracticeIndicators(indicatorsPractice);

      this.$el.append(this.template({
        indicatorsLaw : indicatorsLaw,
        indicatorsPractice : indicatorsPractice
      }));

      $('body').removeClass('csspinner');
    },

    showPopUp: function(e) {
      e && e.preventDefault();

      var self = this;

      var guidelineId = this.guidelineId;
      var pillarId = this.pillarId;
      var countryId = this.countryId;
      var indicatorId = $(e.currentTarget).attr('data');
      var typeId = $(e.currentTarget).attr('data-type');

      this.collection.getByCountry(countryId, pillarId, guidelineId, indicatorId, function(){
        self.data = self.collection.toJSON()[typeId][0];

        $('body').append(self.templateOverlay({
          guideline: self.data['guideline-number'],
          id: self.data['indicator-number'],
          indicator: self.data.indicator,
          description: self.data.description,
          authorComments: self.data['author-comments'],
          privateDiscussions: self.data['private-discussions'],
          discussions: self.data.discussions,
          sources: self.data['source-type'],
          reviewsComments: self.data['reviews-comments'],
          comments: self.data.comments
        }));
      });

      $('body').addClass('is-overflow-hidden');
    }

  });

  return IndicatorsByCountryGuidelines;

});
