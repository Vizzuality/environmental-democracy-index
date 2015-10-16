'use strict';

define([
  'underscore',
  'backbone',
  'presenter',
  'handlebars',
  'models/indicator',
  'collections/pillars',
  'collections/guidelines',
  'text!../../layouts/map-breadcrumbs.handlebars'
], function(_, Backbone, presenter, Handlebars, ModelIndicator, PillarCollection, GuidelinesCollection, tpl) {

  var MapBreadcrumbsView = Backbone.View.extend({

    el: '#map-breadcrumbs',

    guidelinesCollection: new GuidelinesCollection(),
    pillarCollection: new PillarCollection(),

    template: Handlebars.compile(tpl),

    initialize: function() {
      presenter.on('change:pillar change:guideline', this.showGuidelinesByPillar, this);
    },

    getPillars: function() {
      var self = this;

      this.pillarCollection.getPillars(function(){
        self.render();
      });
    },

    getGuidelines:function() {

      this.guidelinesCollection.getByPillar(presenter.get('pillar'), _.bind(function() {
        this.render();
      }, this));
    },

    showGuidelinesByPillar: function() {
      this.pillar = presenter.get('pillar');
      this.guideline = presenter.get('guideline');

      this.getPillars();
      this.getGuidelines();
    },

    render: function() {
      var htmlParams = {};
      htmlParams[this.pillar] = true;
      htmlParams.pillar = _.findWhere(this.pillarCollection.toJSON(), {number: this.pillar});
      htmlParams.guideline = _.findWhere(this.guidelinesCollection.toJSON(), {id: parseInt(this.guideline)});

      htmlParams.url = this.guideline ? this.pillar + '/' + this.guideline : this.pillar;

      this.$el.html(this.template(htmlParams));
    }

  });

  return MapBreadcrumbsView;

});
