'use strict';

define([
  'backbone',
  'presenter',
  'handlebars',
  'collections/pillars',
  'collections/guidelines',
  'views/about-index-indicators',
  'views/guideline',
  'views/guideline-overlay',
  'text!../../layouts/about-index-guidelines.handlebars'
], function(Backbone, presenter, Handlebars, PillarCollection, GuidelinesCollections, IndicatorList, GuidelineView, GuidelineOverlay, tpl) {
  var AboutIndexView = Backbone.View.extend({

    el: '#about-guidelines',

    template:Handlebars.compile(tpl),

    collection: new GuidelinesCollections(),
    pillarCollection: new PillarCollection(),

    events: {
      'click .guidelines-tabs a' : 'showGuidelines',
      'click .guideline' : 'showIndicators',
      'click .more-info-guideline' : 'setGuidelineOverlay'
    },

    initialize: function() {
      this.guidelineView = new GuidelineView();
      this.indicatorList = new IndicatorList();
      this.getPillars();
    },

    getPillars: function() {
      var self = this;

      this.pillarCollection.getPillars(function(){
        self.getGuidelines(1);
      });
    },

    setGuidelineOverlay: function(evt) {
      evt.preventDefault();

      var guideline = $(evt.currentTarget).parent();
      var id = guideline.data('id');

      GuidelineOverlay.setData(id);
    },

    showIndicators: function(evt) {
      evt.preventDefault();

      var currentGuideline = $(evt.currentTarget).parent();
      var guidelineId = currentGuideline.data('id');

      this.indicatorList.getIndicators(this.currentPillar, guidelineId);
    },

    showGuidelines: function(evt) {
      var currentTarget,
        selectedTab;

      evt.preventDefault();

      currentTarget = evt.currentTarget;
      this.currentPillar = $(currentTarget).attr('href').substr(1,1);
      selectedTab = $(currentTarget).attr('href');
      this.getGuidelines(this.currentPillar, selectedTab);
    },

    getGuidelines: function(currentPillar, selectedTab) {
      var self = this;

      this.currentPillar = currentPillar;
      selectedTab = selectedTab || '#1';

      this.$el.addClass('csspinner');
      this.collection.getByPillar(this.currentPillar, function(){
        self.render();
        self.setTab(selectedTab);
      });
    },

    setTab: function(tab) {
      $('.guidelines-tabs a[href="' + tab + '"]')
        .parent()
        .addClass('current');
    },

    render: function() {
      this.$el.html(this.template({
        pillars: this.pillarCollection.toJSON(),
        guidelines: this.collection.toJSON()
      }));

      this.$el.removeClass('csspinner');
    }

  });

  return AboutIndexView;

});
