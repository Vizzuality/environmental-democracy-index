'use strict';

define([
  'backbone',
  'presenter'
], function(Backbone, presenter){

  var RankingRouter = Backbone.Router.extend({

    routes: {
      '(/)' : 'toOverall',
      'all(/)' : 'overall',
      ':pillar(/)' : 'getRankingByPillar',
      ':pillar/:guideline(/)' : 'getRankingByGuideline'
    },

    toOverall: function() {
      this.navigate('all', true);
    },

    overall: function() {
      presenter.set({
        pillar: 'all',
        guideline: null
      }, {
        silent: true
      });

      presenter.trigger('change:pillar');
    },

    getRankingByPillar: function(pillar) {
      presenter.set({
        pillar: pillar,
        guideline: null
      }, {
        silent: true
      });

      presenter.trigger('change:pillar');
    },

    getRankingByGuideline: function(pillar, guideline) {
      presenter.set({
        pillar: pillar,
        guideline: guideline
      }, {
        silent: true
      });

      presenter.trigger('change:guideline');
    }

  });

  return RankingRouter;

});
