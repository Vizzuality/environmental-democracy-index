'use strict';

define(['backbone', 'presenter'], function(Backbone, presenter) {

  var Router = Backbone.Router.extend({

    routes: {
      '(/)': 'toOverall',
      'all(/)' : 'overall',
      ':pillar(/)': 'pillar',
      ':pillar/:guideline(/)': 'guideline',
      ':pillar/:guideline/:indicator(/)': 'indicator',
      ':pillar/:guideline/:indicator/:type(/)': 'type'
    },

    toOverall: function() {
      this.navigate('all', true);
    },

    overall: function() {
      presenter.set({
        pillar: 'all',
        guideline: null,
        indicator: null
      }, {
        silent: true
      });

      presenter.trigger('change:pillar');
    },

    pillar: function(pillar) {
      presenter.set({
        pillar: pillar,
        guideline: null,
        indicator: null
      }, {
        silent: true
      });

      presenter.trigger('change:pillar');
    },

    guideline: function(pillar, guideline) {
      presenter.set({
        pillar: pillar,
        guideline: guideline,
        indicator: null
      }, {
        silent: true
      });

      presenter.trigger('change:guideline');
    },

    // indicator: function(pillar, guideline, indicator) {
    //   presenter.set({
    //     pillar: pillar,
    //     guideline: guideline,
    //     indicator: indicator
    //   }, {
    //     silent: true
    //   });

    //   presenter.trigger('change:indicator');
    // },

    type: function(pillar, guideline, indicator, type) {
      presenter.set({
        pillar: pillar,
        guideline: guideline,
        indicator: indicator,
        type: type
      }, {
        silent: true
      });

      presenter.trigger('change:indicator');
    }

  });

  return Router;

});
