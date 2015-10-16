'use strict';

define([
  'backbone',
  'handlebars',
  'underscore',
  'models/overallScore',
  'models/pillarScores',
  'collections/pillars',
  'collections/countries',
  'collections/guidelines',
  'collections/guidelines-by-country',
  'collections/indicators-by-country',
  'views/compare-indicators-guideline',
  'views/guideline-overlay',
  'views/indicator-overlay',
  'views/chartView',
  'utils',
  'text!../../layouts/compare-guidelines.handlebars'
], function(Backbone, Handlebars, _, OverallScoreModel, pillarScoreModel, PillarCollection, CountriesCollection, GuidelinesCollections, GuidelinesByCountryCollection, IndicatorsByCountry,
    CompareIndicatorsGuideline, GuidelineOverlay, IndicatorOverlay, ChartView, utils, tpl){

  var CompareGuidelinesView = Backbone.View.extend({

    el: '#compare-guidelines',

    template: Handlebars.compile(tpl),
    model: OverallScoreModel,
    pillarModel: pillarScoreModel,

    collection: new GuidelinesCollections(),
    countriesCollection: new CountriesCollection(),
    pillarCollection: new PillarCollection(),
    scoreGuidelineCollection: new GuidelinesByCountryCollection(),
    indicatorsByContryCollection: new IndicatorsByCountry(),

    events: {
      'click .guidelines-tabs a' : 'getGuidelineId',
      'click .guideline': 'getIndicators',
      'click .more-info-guideline' : 'setGuidelineOverlay',
      'click .more-info-indicator' : 'setIndicatorOverlay',
      'click .btn-print-compare' : 'print',
    },

    initialize: function() {
      if ($(window).width() > 625) {
        $(window).scroll(utils.throttle(this.fixBar, 30));
      }

      this.overalls = {};
      this.indicatorView = new CompareIndicatorsGuideline();

      Backbone.Events.on('setCountries', this.getPillars, this);
    },

    getCountriesIso: function() {
      var self = this;
      var deferred = new $.Deferred();

      this.countriesCollection.getCountries(function() {
        self.countriesIso = self.countriesCollection.toJSON();
        deferred.resolve();
      });

      return deferred.promise();
    },

    getSelectedCountriesNames: function() {
      var self = this;
      var countryName;
      this.countriesNames = {};

      for (var i = 0; i < this.selectedCountriesIso.length; i++) {
        if (self.selectedCountriesIso[i] !== '') {
          countryName = _.findWhere(self.countriesIso, {'field_iso': self.selectedCountriesIso[i] }).country;
          self.countriesNames['country-' + i] = countryName;
        }
      }

      return this.countriesNames;
    },

    getPillars: function(data) {
      this.selectedCountries = data;

      var self = this;

      this.pillarCollection.getPillars(function(){
        self.setCountries(data);
      });

      this.selectedCountriesIso = data;

      $.when(this.getCountriesIso()).done(function() {
        self.getSelectedCountriesNames();
      });
    },

    scroll: function() {
      $('html, body').animate({
        scrollTop: $('#compare-guidelines').offset().top - 50
      }, 300);
    },

    setGuidelineOverlay: function(evt) {
      evt.preventDefault();

      var li = $(evt.currentTarget).closest('li');
      var id = li.data('id');

      GuidelineOverlay.setData(id);
    },

    setIndicatorOverlay: function(evt) {
      evt.preventDefault();

      var li = $(evt.currentTarget).closest('li');
      var indicatorNumber = li.data('number');
      var indicatorType = li.data('type');

      this.guideline = li.closest('.guidelines').data('id');

      IndicatorOverlay.setData(indicatorNumber, indicatorType, this.guideline);
    },

    setCountries: function(data) {
      this.countries = data;
      this.getScoreGuidelines(1);
    },

    setTab: function(tab) {
      $('.guidelines-tabs a[href="#' + tab + '"]')
        .parent()
        .addClass('current');
    },

    getIndicators: function(evt) {
      evt.preventDefault();

      this.guideline = $(evt.currentTarget).parent().data('id');
      this.indicator = '';

      this.indicatorView.getIndicators(this.countries, this.pillar, this.guideline, this.indicator);
    },

    getGuidelineId: function(evt) {
      evt.preventDefault();

      $('#compare-guidelines').parent().addClass('csspinner');
      this.pillar = $(evt.currentTarget).attr('href');
      this.pillar = this.pillar.slice(1, this.pillar.length);

      this.getScoreGuidelines(this.pillar);
    },

    getGlobalGuidelines: function() {
      var self = this,
        deferred = new $.Deferred();

      this.collection.getByPillar(this.pillar, function(){
        self.globalGuidelines = self.collection.toJSON();
        deferred.resolve();
      });

      return deferred.promise();
    },

    getGuidelineScoreA: function() {
      var self = this,
        deferred = new $.Deferred();

      if (this.countries[0]) {
        this.scoreGuidelineCollection.getByPillar(this.countries[0], this.pillar, function(){
          self.scoreCountryA = self.scoreGuidelineCollection.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    getOverallScoreA: function() {
      var self = this,
        deferred = new $.Deferred();

      if (this.countries[0]) {
        this.model.getOverallScore(this.countries[0], function(){
          self.overallCountryA = self.model.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    getPillarsScoreA: function() {
      var self = this,
        deferred = new $.Deferred();

      if (this.countries[0]) {
        this.pillarModel.getPillarScore(this.countries[0], function(){
          self.pillarsCountryA = self.pillarModel.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    getGuidelineScoreB: function() {
      var self = this,
        deferred = new $.Deferred();

      if (this.countries[1]) {
        this.scoreGuidelineCollection.getByPillar(this.countries[1], this.pillar, function(){
          self.scoreCountryB = self.scoreGuidelineCollection.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    getOverallScoreB: function() {
      var self = this,
        deferred = new $.Deferred();
        if (this.countries[1]) {
          this.model.getOverallScore(this.countries[1], function(){
            self.overallCountryB = self.model.toJSON();
            deferred.resolve();
          });

          return deferred.promise();
        }
    },

    getPillarsScoreB: function() {
      var self = this,
        deferred = new $.Deferred();

      if (this.countries[1]) {
        this.pillarModel.getPillarScore(this.countries[1], function(){
          self.pillarsCountryB = self.pillarModel.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    getGuidelineScoreC: function() {
      var self = this,
        deferred = new $.Deferred();

      if (this.countries[2]) {
        this.scoreGuidelineCollection.getByPillar(this.countries[2], this.pillar, function(){
          self.scoreCountryC = self.scoreGuidelineCollection.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    getOverallScoreC: function() {
      var self = this,
        deferred = new $.Deferred();

        if (this.countries[2]) {
          this.model.getOverallScore(this.countries[2], function(){
            self.overallCountryC = self.model.toJSON();
            deferred.resolve();
          });

          return deferred.promise();
        }
    },

    getPillarsScoreC: function() {
      var self = this,
        deferred = new $.Deferred();

      if (this.countries[2]) {
        this.pillarModel.getPillarScore(this.countries[2], function(){
          self.pillarsCountryC = self.pillarModel.toJSON();
          deferred.resolve();
        });

        return deferred.promise();
      }
    },

    getScoreGuidelines: function(pillar) {
      var self;
        self = this;

      this.pillar = this.pillar || pillar;

      $('#compare-guidelines').parent().addClass('csspinner');

      $.when(this.getGlobalGuidelines(), this.getGuidelineScoreA(), this.getGuidelineScoreB(), this.getGuidelineScoreC(),
        this.getOverallScoreA(), this.getPillarsScoreA(), this.getOverallScoreB(), this.getPillarsScoreB(), this.getOverallScoreC(), this.getPillarsScoreC()).done(function() {
        self.render();
        self.setTab(self.pillar);
      });
    },

    print: function() {
      window.print();
    },

    fixBar: function() {
      var $nameBar = $('.guideline-wrapper');
      var $elementToFix = $('#name-bar');
      var $elementToModify = $('.mod-guidelines');
      var $stopReference = $('.btn-print-compare');

      if ($nameBar.length === 0) {
        return;
      }

      var scrollTop = $(window).scrollTop(),
          elementOffset = $nameBar.offset().top,
          stopPoint = $stopReference.offset().top - 50;

      if ( scrollTop > elementOffset && scrollTop < stopPoint) {
        $elementToFix.addClass('is-fix');
        $elementToModify.css({marginTop: 59});
      } else {
        $elementToFix.removeClass('is-fix');
        $elementToModify.css({marginTop: 0});
      }
    },

    render: function() {
      for (var i = 0; i < this.globalGuidelines.length; i++) {
        if (this.scoreCountryA) {
          this.globalGuidelines[i].scoreCountryA = this.scoreCountryA[i].score;
        }

        if (this.scoreCountryB) {
         this.globalGuidelines[i].scoreCountryB = this.scoreCountryB[i].score;
        }

        if (this.scoreCountryC) {
          this.globalGuidelines[i].scoreCountryC = this.scoreCountryC[i].score;
        }
      }

      this.overalls = {};

      if (this.overallCountryA) {

        _.extend(this.overalls, {
          countryA: this.countries[0],
          scoreA: this.overallCountryA.score,
          colorScoreA: this.getColor(this.overallCountryA.score)
        });
      }

      if (this.overallCountryB) {

        _.extend(this.overalls, {
          countryB: this.countries[1],
          scoreB: this.overallCountryB.score,
          colorScoreB: this.getColor(this.overallCountryB.score)
        });
      }

      if (this.overallCountryC) {

        _.extend(this.overalls, {
          countryC: this.countries[2],
          scoreC: this.overallCountryC.score,
          colorScoreC: this.getColor(this.overallCountryC.score)
        });
      }

      if (this.pillarsCountryA) {
        this.roundScoresA = this.getScorePillars(this.pillarsCountryA);
      }

      if (this.pillarsCountryB) {
        this.roundScoresB = this.getScorePillars(this.pillarsCountryB);
      }

      if (this.pillarsCountryC) {
       this.roundScoresC = this.getScorePillars(this.pillarsCountryC);
      }

      var self = this;

      $.each( self.globalGuidelines, function(i) {
        self.getScore(self.globalGuidelines[i].scoreCountryA, self.globalGuidelines[i], 'roundScoreA');
        self.getScore(self.globalGuidelines[i].scoreCountryB, self.globalGuidelines[i], 'roundScoreB');
        self.getScore(self.globalGuidelines[i].scoreCountryC, self.globalGuidelines[i], 'roundScoreC');
      });


      this.$el.html(this.template({
        pillars: this.pillarCollection.toJSON(),
        overalls: this.overalls,
        guidelines: this.globalGuidelines,
        pillarsCountryA: this.pillarsCountryA,
        pillarsCountryB: this.pillarsCountryB,
        pillarsCountryC: this.pillarsCountryC,
        roundScoresA: this.roundScoresA,
        roundScoresB: this.roundScoresB,
        roundScoresC: this.roundScoresC,
        countriesNames: this.countriesNames
      }));

      this.overalls = {};
      this.overallCountryA = null;
      this.overallCountryB = null;
      this.overallCountryC = null;

      this.scoreCountryA = null;
      this.scoreCountryB = null;
      this.scoreCountryC = null;

      if(this.globalGuidelines) {
        _.map(this.globalGuidelines, function(guideline) {
          if(guideline.id === 7 || guideline.id === 14 || guideline.id === 25) {
            var currentGuideline = $('#guideline-' + guideline.id);
            currentGuideline.addClass('no-indicators');
          }
        });
      }

      $('#compare-guidelines').parent().removeClass('csspinner');

      this.drawCharts();
    },

    drawCharts: function() {
      var self = this;

      $.each(this.selectedCountries, function(i) {

        if (this !== '') {
          var countriesWrappers = {
            0: '#scoresCountryA',
            1: '#scoresCountryB',
            2: '#scoresCountryC',
          };

          var countryName = _.findWhere(self.countriesIso, {'field_iso': this }).country;
          new ChartView({ el: countriesWrappers[i] , country: this, countryName: countryName });
        }
      });
    },

    getCountrieName: function(iso) {
      var self = this;
      var countryName = _.findWhere(self.countriesIso, {'field_iso': iso }).country;
      return countryName;
    },

    getScore: function(score, guideline, country) {
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

      guideline[country] = roundScore;

      return guideline;
    },

    getScorePillars: function(scores) {
      var roundScores = {};
      $.each( scores, function(key, value) {
        if (value <= 0.75) {
          roundScores[key] = 'score-1';
        } else if (value > 0.75 && value <= 1.50) {
          roundScores[key] = 'score-2';
        } else if (value > 1.50 && value <= 2.25) {
          roundScores[key] = 'score-3';
        } else if (value > 2.25) {
          roundScores[key] = 'score-4';
        }
      });

      // scores[country] = roundScore;

      return roundScores;
    },

    getColor: function(score) {
      var color;

      if (score <= 0.75) {
        color = '#E1BD08';
      } else if (score > 0.75 && score <= 1.50) {
        color = '#F8E969';
      } else if (score > 1.50 && score <= 2.25) {
        color = '#ABD7F9';
      } else if (score > 2.25) {
        color = '#42A1DF';
      } else {
        color = '#dddddd';
      }

      return color;
    }

  });

  return CompareGuidelinesView;

});
