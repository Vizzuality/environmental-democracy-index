'use strict';

define([
  'backbone',
  'underscore',
  'handlebars',
  'd3',
  'models/country',
  'models/overallScore',
  'models/pillarScores',
  'models/countries-generic-data',
  'views/chartView',
  'text!../../layouts/country-highlights.handlebars'
], function(Backbone, _, Handlebars, d3, CountryModel, OverallScoreModel, PillarScoreModel, GenericDataFile, ChartView, tpl) {

  var CountryHighlightsView = Backbone.View.extend({

    model: CountryModel,
    overallScoreModel: OverallScoreModel,
    pillarScoreModel: PillarScoreModel,
    defaultDataFile: GenericDataFile,

    el: '#country-highlights',

    template: Handlebars.compile(tpl),

    updatedIso: ['chn', 'gtm', 'ind', 'ltu', 'mex', 'rou', 'rus'],

    events: {
      'click .definition' : 'cancelLink'
    },

    initialize: function() {
      Backbone.Events.on('setISO', this.setISO, this);
    },

    setISO: function(countryModel) {
      this.iso = countryModel.iso;

      $('#country-highlights').addClass('csspinner');
      this.getInfoByCountry(this.iso);
    },

    cancelLink: function(ev) {
      ev.preventDefault();
    },

    getInfo: function() {
      var self = this,
        deferred = new $.Deferred();

      this.model.getByCountryId(this.iso, function(){
        self.dataCountry = self.model.toJSON();
        deferred.resolve();
      });

      return deferred.promise();
    },

    getOverallScore: function() {
      var self = this,
        deferred = new $.Deferred();

      this.overallScoreModel.getOverallScore(this.iso, function(){
        self.overallScoreCountry = self.overallScoreModel.toJSON();
        deferred.resolve();
      });

      return deferred.promise();
    },

    getPillarScore: function() {
      var self = this,
        deferred = new $.Deferred();

      this.pillarScoreModel.getPillarScore(this.iso, function(){
        self.pillarScoreCountry = self.pillarScoreModel.toJSON();
        deferred.resolve();
      });

      return deferred.promise();
    },

    getInfoByCountry: function() {
      var self = this;

      $.when(this.getInfo(), this.getOverallScore(), this.getPillarScore(), this.getDefaultFile())
        .done(function(){
          self.render();
          $('#country-figure').parent().addClass('csspinner');
          self.drawCountry();
        });
    },

    drawCountry: function() {
      this.chart = new ChartView({ el: '#country-figure', country: this.iso });
      $('#country-figure').parent().removeClass('csspinner');
    },

    getDefaultFile: function() {
      var self = this;
      var deferred = new $.Deferred();

      this.defaultDataFile.getGenericFile(function() {
        self.defaultFile = self.defaultDataFile.toJSON()[0].default_country_data;
        deferred.resolve();
      });

      return deferred.promise();
    },

    getUpdateCountry: function() {
      if (_.contains(this.updatedIso, this.dataCountry.iso)) {
        $('.mod-highlighted h1').addClass('is-updated');
      }
    },

    render: function() {
      var otherInfo;

      otherInfo = {
        'doing-well': this.dataCountry['doing-well'],
        'recommendations': this.dataCountry.recommendations,
        'govResponse': this.dataCountry['government-responses'],
        'responseFile': this.dataCountry['government-response-file'],
        'researcher': this.dataCountry.researcher,
        'reviewer': this.dataCountry.reviewer
      };

      var score = this.overallScoreCountry.score;

      if (score <= 0.75) {
        this.scoreColor = '#E1BD08';
      } else if (score > 0.75 && score <= 1.50) {
        this.scoreColor = '#F8E969';
      } else if (score > 1.50 && score <= 2.25) {
        this.scoreColor = '#ABD7F9';
      } else if (score > 2.25) {
        this.scoreColor = '#42A1DF';
      } else {
        this.scoreColor = '#dddddd';
      }

      var self = this;
      this.roundScores = {};

      _.bind(this.getScore, this);

      $.each( this.pillarScoreCountry, function( key, value) {
        self.getScore(key, value);
      });

      this.$el.html(this.template({
        country: this.dataCountry,
        overallScore: this.overallScoreCountry,
        pillarScores: this.pillarScoreCountry,
        scoreColorTemplate: this.scoreColor,
        roundScores: this.roundScores,
        defaultFile: this.defaultFile
      }));

      //Backbone.Events.trigger('setOtherInfo', government);
      Backbone.Events.trigger('setInfo', otherInfo);

      $('#country-highlights').removeClass('csspinner');

      this.getUpdateCountry();
    },

    getScore: function(key, score) {

      if (score < 0.75) {
        this.roundScores[key] = 'score-1';
      } else if (score >= 0.75 && score < 1.50) {
        this.roundScores[key] = 'score-2';
      } else if (score >= 1.50 && score < 2.25) {
        this.roundScores[key] = 'score-3';
      } else if (score >= 2.25) {
        this.roundScores[key] = 'score-4';
      }

      return this.roundScores;
    }

  });

  return CountryHighlightsView;

});
