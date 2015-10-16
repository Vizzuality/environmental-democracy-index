'use strict';

define([
  'underscore',
  'backbone',
  'presenter',
  'handlebars',
  'models/indicator',
  'collections/pillars',
  'collections/guidelines',
  'text!../../layouts/dashboard.handlebars',
  'text!../../layouts/dashboard-guidelines.handlebars',
  'text!../../layouts/dashboard-pillars.handlebars'
], function(_, Backbone, presenter, Handlebars, ModelIndicator, PillarCollection, GuidelinesCollection, dashboardTpl, guidelinesTpl, pillarsTpl) {

  var DashboardView = Backbone.View.extend({

    el: '#dashboardView',
    collection: new GuidelinesCollection(),
    pillarCollection: new PillarCollection(),
    dashboardTemplate: Handlebars.compile(dashboardTpl),
    guidelinesTemplate: Handlebars.compile(guidelinesTpl),
    pillarsTemplate: Handlebars.compile(pillarsTpl),

    events: {
      'change .practice-indicators' : 'changeIndicatorsMode'
    },

    initialize: function() {
      this.$wrapper = $('#overall-wrapper');
      this.getPillars();
      presenter.on('change:pillar change:guideline change:indicator', this.showGuidelinesByPillar, this);
      Backbone.Events.on('indicators:load', this.toggleModeIndicators, this);
      this.renderDashboard();
    },

    getPillars: function() {
      var self = this;

      this.pillarCollection.getPillars(function(){
        self.render();
      });
    },

    showGuidelinesByPillar: function() {
      var currentPillar = presenter.get('pillar');

      $('.guidelines-wrapper').html('');
      $('.guidelines-tabs').find('.tab-link')
        .removeClass('is-current').removeClass('is-selected');

      if(currentPillar !== 'all') {
        $('.guidelines-wrapper').parent().addClass('csspinner');
        this.collection.getByPillar(currentPillar, _.bind(function() {
          this.deleteWrapper();
          this.render();
        }, this));
      } else {
        this.showWrapper();
      }

      if (!this.mode) {
        this.checkMode();
      }
    },

    showWrapper: function() {
      $('.overall-link').addClass('is-current is-selected');
      this.$wrapper.removeClass('is-hidden');
    },

    deleteWrapper: function () {
      $('.overall-link').removeClass('is-current').removeClass('is-selected');
      this.$wrapper.addClass('is-hidden');
    },

    render: function() {
      var guidelines = this.collection.toJSON();

      this.$('.guidelines-wrapper').html(this.guidelinesTemplate({
        guidelines: guidelines
      }));

      this.$('.dashboard-tabs').html(this.pillarsTemplate({
        pillars: this.pillarCollection.toJSON()
      }));

      if (presenter.get('pillar') === 'all' || !presenter.get('pillar')) {
        this.showWrapper();
      } else {
        this.deleteWrapper();
        $('#pillar' + presenter.get('pillar')).addClass('is-selected is-current');
      }

      if(guidelines) {
        _.map(guidelines, function(guideline) {
          if(guideline.id === 7 || guideline.id === 14 || guideline.id === 25) {
            var currentGuideline = $('#guideline-' + guideline.id);
            currentGuideline.addClass('no-indicators');
          }
        });
      }

      $('.guidelines-wrapper').parent().removeClass('csspinner');
      Backbone.Events.trigger('dashboard:load');
    },

    renderDashboard: function() {
      this.$el.html(this.dashboardTemplate());
    },

    checkMode: function() {
      this.mode = presenter.get('type');
      this.toggleModeIndicators();

      if (this.mode === 'Practice') {
        $('.practice-indicators').prop('checked', true);
      }
    },

    changeIndicatorsMode: function() {
      var checked = $('.practice-indicators').prop('checked');

      if (checked) {
        this.mode = 'Practice';
      } else {
        this.mode = 'Law';
      }

      this.toggleModeIndicators();
    },

    toggleModeIndicators: function() {
      var $inLawIndicators = $('.indicators-in-law');
      var $inPracticeIndicators = $('.indicators-in-practice');
      var $wrapper = $('.checkbox-wrapper');
      var $labelLaw = $('.mode-label.law');
      var $labelPractice = $('.mode-label.practice');

      if(this.mode === 'Practice') {
        $inLawIndicators.addClass('is-hidden');
        $inPracticeIndicators.removeClass('is-hidden');
        $wrapper.addClass('is-practice-mode');
        $labelPractice.addClass('is-selected');
        $labelLaw.removeClass('is-selected');
      } else {
        $inLawIndicators.removeClass('is-hidden');
        $inPracticeIndicators.addClass('is-hidden');
        $wrapper.removeClass('is-practice-mode');
        $labelPractice.removeClass('is-selected');
        $labelLaw.addClass('is-selected');
      }
    }

  });

  return DashboardView;

});
