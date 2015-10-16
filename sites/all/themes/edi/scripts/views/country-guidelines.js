'use strict';

define([
  'underscore',
  'backbone',
  'handlebars',
  'models/country',
  'collections/pillars',
  'collections/guidelines-by-country',
  'views/indicators-by-country-guidelines',
  'views/guideline-overlay',
  'views/indicator-overlay',
  'text!../../layouts/country-guidelines.handlebars'
], function(_, Backbone, Handlebars, CountryModel, PillarCollection, GuidelinesByCountryCollection,
  IndicatorsByCountryGuidelines, GuidelineOverlay, IndicatorOverlay, tpl) {

  var CountryGuidelinesView = Backbone.View.extend({

    el: '#country-guidelines',

    template: Handlebars.compile(tpl),

    model: CountryModel,
    collection: new GuidelinesByCountryCollection(),
    pillarCollection: new PillarCollection(),

    events: {
      'click .guidelines-tabs a' : 'getGuidelines',
      'click .guideline' : 'getIndicators',
      'click .more-info-guideline' : 'setGuidelineOverlay',
      'click .more-info-indicator' : 'setIndicatorOverlay',
      'click .btn-read-more' : 'readMore',
      'click .btn-read-less' : 'readLess'
    },

    initialize: function() {
      this.currentPillar;
      this.indicatorView = new IndicatorsByCountryGuidelines();

      Backbone.Events.on('setInfo', this.setInfo, this);
    },

    getIndicators: function(evt) {
      evt.preventDefault();
      var guidelineId = $(evt.currentTarget).parent().attr('data-number');
      this.indicatorView.getIndicators(this.model.get('iso'), this.currentPillar, guidelineId);
    },

    setTab: function(tab) {
      $('.guidelines-tabs a[href="' + tab + '"]')
        .parent()
        .addClass('current');
    },

    setGuidelineOverlay: function(evt) {
      evt.preventDefault();

      var li = $(evt.currentTarget).closest('li');
      var id = li.data('number');

      GuidelineOverlay.setData(id);
    },

    setIndicatorOverlay : function(evt) {
      evt.preventDefault();

      var li = $(evt.currentTarget).closest('li');
      var indicatorNumber = li.data('number');
      var indicatorType = li.data('type');
      var guideline = li.closest('.guidelines').data('number');

      IndicatorOverlay.setData(indicatorNumber, indicatorType, guideline);
    },

    getGuidelines: function(evt) {
      var currentTarget,
          self,
          selectedTab;

      self = this;
      evt.preventDefault();

      currentTarget = evt.currentTarget;
      this.currentPillar = $(currentTarget).attr('href').substr(1,1);
      selectedTab = $(currentTarget).attr('href');
      this.showGuidelines(this.currentPillar, selectedTab);
    },

    showGuidelines: function(currentPillar, selectedTab) {
      var self,
          iso;
      self = this;
      iso = this.model.get('iso');
      this.currentPillar = currentPillar;
      selectedTab = selectedTab || '#1';

      $('.guidelines-index').addClass('csspinner');

      this.collection.getByPillar(iso, this.currentPillar, function(){
        self.render();
        self.setTab(selectedTab);
        $('.guidelines-index').removeClass('csspinner');
      });
    },

    getPillars: function() {
      var self = this;

      this.pillarCollection.getPillars(function(){
        self.showGuidelines(1, undefined);
      });
    },

    setInfo: function(data) {
      this.info = data;
      this.getPillars();
    },

    render: function() {
      var guidelines;
      guidelines = this.collection.toJSON();

      var self = this;

      $.each( guidelines, function(i) {
        self.getScore(guidelines[i].score, guidelines[i]);
      });

      this.$el.html(this.template({
        pillars: this.pillarCollection.toJSON(),
        guidelines : guidelines,
        info: this.info
      }));

      if(guidelines) {
        _.map(guidelines, function(guideline) {
          if(guideline.number === 7 || guideline.number === 14 || guideline.number === 25) {
            var currentGuideline = $('#guideline-' + guideline.number);
            currentGuideline.addClass('no-indicators');
          }
        });
      }

      var textHeight = $('.text-wrapper').height();

      if (textHeight > 137) {
        this.clampText();
      }
      // } else if (textHeight > 114 && $(document).width() <= 640) {
      //   this.clampText();
      // }
    },

    readMore: function(e) {
      $('.text-wrapper').removeClass('is-clamped');
      $(e.currentTarget).addClass('is-hidden');
      $('.btn-read-less').removeClass('is-hidden');
    },

    readLess: function(e) {
      $('.text-wrapper').addClass('is-clamped');
      $(e.currentTarget).addClass('is-hidden');
      $('.btn-read-more').removeClass('is-hidden');
    },

    clampText: function() {
      $('.text-wrapper').addClass('is-clamped');
      $('.btn-read-more').removeClass('is-hidden');
    },

    getScore: function(score, guideline) {
      var roundScore;

      if (score <= 0.75) {
        roundScore = 'score-1';
      } else if (score > 0.75 && score <= 1.50) {
        roundScore = 'score-2';
      } else if (score > 1.50 && score <= 2.25) {
        roundScore = 'score-3';
      } else if (score > 2.25) {
        roundScore = 'score-4';
      }

      guideline.roundScore = roundScore;

      return guideline;
    }

  });

  return CountryGuidelinesView;

});
