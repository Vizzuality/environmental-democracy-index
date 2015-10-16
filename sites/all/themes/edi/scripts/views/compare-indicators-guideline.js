'use strict';

define([
  'underscore',
  'backbone',
  'handlebars',
  'collections/indicators-by-country',
  'views/indicator-type-overlay',
  'text!../../layouts/compare-indicators.handlebars'
], function(_, Backbone, Handlebars, IndicatorsByCountry, IndicatorTypeOverlay, tpl){

  var CompareIndicatorsGuideline = Backbone.View.extend({

    collection: new IndicatorsByCountry(),

    template: Handlebars.compile(tpl),

    events: {
      'click .more-info-type-indicator': 'setIndicatorTypeOverlay'
    },

    getIndicators: function(countries, pillar, guideline) {
      this.pillar = pillar;
      this.guideline = guideline;
      this.countries = countries;
      this.indicator = '';

      this.el = '#guideline-' + this.guideline;
      this.setElement(this.el);

      $('.guidelines a').unbind('click');

      this.$el.find('.indicators').remove();
      if(!(this.$el.hasClass('is-open'))) {
        this.$el.addClass('is-open');
        this.getScores();
      } else {
        this.$el.removeClass('is-open');
      }
    },

    setScoreA: function() {
      var self = this,
        deferred = new $.Deferred();

      if(this.countries[0]) {
        this.collection.getByCountry(this.countries[0], this.pillar, this.guideline, this.indicator, function() {
          self.indicatorsCountryA = self.collection.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    setScoreB: function() {
      var self = this,
        deferred = new $.Deferred();

      if(this.countries[1]) {
        this.collection.getByCountry(this.countries[1], this.pillar, this.guideline, this.indicator, function() {
          self.indicatorsCountryB = self.collection.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    setScoreC: function() {
      var self = this,
        deferred = new $.Deferred();

      if(this.countries[2]) {
        this.collection.getByCountry(this.countries[2], this.pillar, this.guideline, this.indicator, function() {
          self.indicatorsCountryC = self.collection.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    getScores: function() {
      var self = this;

      this.$el.parent().addClass('csspinner');

      $.when(this.setScoreA(), this.setScoreB(), this.setScoreC()).done(function() {
        self.setScores();
        self.$el.parent().removeClass('csspinner');
      });
    },

    setScores: function() {
      var index;

      this.scoresLaw = this.indicatorsCountryA || this.indicatorsCountryB || this.indicatorsCountryC;
      this.scoresPractice = this.scoresLaw;

      if (this.scoresLaw.Law) {

        for (index = 0; index < this.scoresLaw.Law.length; index++) {
          if (this.indicatorsCountryA && this.indicatorsCountryA.Law.length > 0) {
            this.scoresLaw.Law[index].scoreA = this.indicatorsCountryA.Law[index].score;
          }

          if (this.indicatorsCountryB && this.indicatorsCountryB.Law.length > 0) {
            this.scoresLaw.Law[index].scoreB = this.indicatorsCountryB.Law[index].score;
          }

          if (this.indicatorsCountryC && this.indicatorsCountryC.Law.length > 0) {
           this.scoresLaw.Law[index].scoreC = this.indicatorsCountryC.Law[index].score;
          }

          delete this.scoresLaw.Law[index].score;
        }
      }

      if (this.scoresPractice.Practice) {

        for (index = 0; index < this.scoresPractice.Practice.length; index++) {
          if (this.indicatorsCountryA && this.indicatorsCountryA.Practice.length > 0) {
            this.scoresPractice.Practice[index].scoreA = this.indicatorsCountryA.Practice[index].score;
          }

          if (this.indicatorsCountryB && this.indicatorsCountryB.Practice.length > 0) {
            this.scoresPractice.Practice[index].scoreB = this.indicatorsCountryB.Practice[index].score;
          }

          if (this.indicatorsCountryC && this.indicatorsCountryC.Practice.length > 0) {
            this.scoresPractice.Practice[index].scoreC = this.indicatorsCountryC.Practice[index].score;
          }

          delete this.scoresPractice.Practice[index].score;
        }
      }

      this.indicatorsCountryA = null;
      this.indicatorsCountryB = null;
      this.indicatorsCountryC = null;

      this.render();
    },

    setPracticeIndicators: function(practiceCollection) {
      _.each(practiceCollection, function(indicator) {

        if (indicator.scoreA) {

          if (indicator.scoreA === '1') {
            indicator.scoreA = 'limited';
          } else if (indicator.scoreA === '2') {
            indicator.scoreA = 'yes';
          } else {
            indicator.scoreA = 'no';
          }
        }

        if (indicator.scoreB) {

          if (indicator.scoreB === '1') {
            indicator.scoreB = 'limited';
          } else if (indicator.scoreB === '2') {
            indicator.scoreB = 'yes';
          } else {
            indicator.scoreB = 'no';
          }
        }

        if (indicator.scoreC) {

          if (indicator.scoreC === '1') {
            indicator.scoreC = 'limited';
          } else if (indicator.scoreC === '2') {
            indicator.scoreC = 'yes';
          } else {
            indicator.scoreC = 'no';
          }
        }

      });
    },

    setIndicatorTypeOverlay: function(evt) {
      evt.preventDefault();

      var type = $(evt.currentTarget).attr('data-type');
      IndicatorTypeOverlay.render(type);
    },

    render: function() {

      this.setPracticeIndicators(this.scoresPractice.Practice);

      this.$el.append(this.template({
        indicatorsLaw: this.scoresLaw.Law,
        indicatorsPractice: this.scoresPractice.Practice
      }));
    }

  });

  return CompareIndicatorsGuideline;

});
