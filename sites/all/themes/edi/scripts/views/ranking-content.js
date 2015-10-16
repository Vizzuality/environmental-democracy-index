'use strict';

define([
  'underscore',
  'backbone',
  'handlebars',
  'presenter',
  'collections/overallRanking',
  'collections/pillarScoreRanking',
  'collections/ranking-scores',
  'views/federal-disclaimer',
  'views/chartView',
  'text!../../layouts/ranking-content.handlebars'
], function(_, Backbone, Handlebars, presenter,
  OverallScoresCollection, PillarScoreCollection, RankingScoresCollection,
  FederalDisclaimer, ChartView, tpl) {

  var RankingContentView = Backbone.View.extend({

    el: '#ranking-content',

    template: Handlebars.compile(tpl),

    overallCollection: new OverallScoresCollection(),
    pillarCollection: new PillarScoreCollection(),
    guidelineCollection: new RankingScoresCollection(),

    events: {
      'click .btn-go-to': 'goToTop'
    },

    initialize: function() {
      Backbone.Events.on('applyRanking', this.setRanking, this);
      new FederalDisclaimer();
    },

    setColors: function(collection) {
      return _.map(collection.toJSON(), function(country){
        if (parseFloat(country.score) >= 0 && parseFloat(country.score) <= 0.75) {
          country.scoreClass = 'score-1';
        } else if (parseFloat(country.score) > 0.75 && parseFloat(country.score) <= 1.50) {
          country.scoreClass = 'score-2';
        } else if (parseFloat(country.score) > 1.50 && parseFloat(country.score) <= 2.25) {
          country.scoreClass = 'score-3';
        } else {
          country.scoreClass = 'score-4';
        }
        return country;
      });
    },

    setRanking: function(pre) {
      if(pre.guideline) {
        this.setRankingByGuideline();
      } else {
        this.setRankingByPillar();
      }
    },

    setRankingByPillar: function() {
      var self = this;

      this.$el.addClass('csspinner');

      if(presenter.get('pillar') === 'all') {
        this.overallCollection.getOverallScore(function(){
          self.getData(self.overallCollection);
        });
      } else {
        this.pillarCollection.getPillarScores(presenter.get('pillar'), function(){
          self.getData(self.pillarCollection);
        });
      }
    },

    setRankingByGuideline: function() {
      var self = this;

      this.$el.addClass('csspinner');

      this.guidelineCollection.getScoresByGuideline(presenter.get('guideline'), function(){
        self.getData(self.guidelineCollection);
      });
    },

    goToTop: function() {
      $('body, html').animate({scrollTop:0}, '500');
    },

    setAverage: function() {
      var total = 0;

      _.each(this.dataRanking, function(country) {
        total += parseFloat(country.score);
      });

      var average = total / this.dataRanking.length;
      average = average.toFixed(2);
      var obj_average = {
        country: 'Average',
        score: average
      };

      this.dataRanking.push(obj_average);

      this.dataRanking = _.sortBy(this.dataRanking, function(x){
        return -x.score;
      });
    },

    getData: function(collection) {
      this.dataRanking = this.setColors(collection);
      this.pillarTitle = null;
      this.countryDescription = null;

      if(this.dataRanking[0]) {
        this.pillarTitle = this.dataRanking[0].pillar || this.dataRanking[0].guideline || this.dataRanking[0].title;
        this.countryDescription = this.dataRanking[0]['guideline-desc'] || this.dataRanking[0].description;
      }

      this.setAverage();
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        dataRanking: this.dataRanking
      }));

      this.$el.removeClass('csspinner');
      this.drawPie();

      Backbone.Events.trigger('changeTitle', {
        title : this.pillarTitle
      });
    },

    drawPie: function() {
      var countries = $('.ranking-table .country');

      $.each(countries, function() {
        var el = $(this).find('.practice-indicators-pie');
        var countryIso = $(this).attr('data-iso');
        new ChartView({ el: el, country: countryIso });
      });
    }

  });

  return RankingContentView;

});
