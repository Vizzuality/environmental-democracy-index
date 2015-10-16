'use strict';

define([
  'underscore',
  'backbone',
  'handlebars',
  'select2',
  'presenter',
  'utils',
  'collections/pillars',
  'collections/guidelines',
  'collections/overallRanking',
  'text!../../layouts/ranking-selector.handlebars',
  'text!../../layouts/ranking-btn-description.handlebars'
], function(_, Backbone, Handlebars, select2, presenter, utils,
  PillarCollection, GuidelinesCollections, OverallScoresCollection,
  tpl, btnTemplate) {

  var RankingSelectorView = Backbone.View.extend({

    el: '#ranking-selector',

    template: Handlebars.compile(tpl),
    btnTemplate: Handlebars.compile(btnTemplate),
    overallCollection: new OverallScoresCollection(),
    collection: new GuidelinesCollections(),
    pillarCollection: new PillarCollection(),

    events: {
      'click button': 'showOverall',
      'click #view-map' : 'viewMap'
    },

    initialize: function() {
      this.render();
      this.getPillars();

      $(window).scroll(utils.throttle(this.fixSelectors, 30));

      presenter.on('change:pillar', this.setSelects, this);
      presenter.on('change:guideline', this.setSelects, this);

      Backbone.Events.on('changeTitle', this.actualizeDescription, this);
    },

    viewMap: function() {
      window.location.href = '/map' + window.location.hash;
    },

    savePillar: function() {
      var pillarId = $('#select-pillar option:selected').val();

      if(pillarId === '') {
        pillarId = 'all';
      }

      presenter.set({
        pillar: pillarId,
        guideline: null
      }, { silent: true });

      this.getGuidelinesByPillar();
      // this.actualizeDescription();
    },

    saveGuideline: function() {
      var guideline = $('#select-guideline option:selected').val();

      presenter.set({
        guideline: guideline
      }, { silent: true});

      if(guideline !== '') {
        window.rankingRouter.navigate('#' + presenter.get('pillar') + '/' + guideline, false);
      } else {
        window.rankingRouter.navigate('#' + presenter.get('pillar'), false);
      }
      Backbone.Events.trigger('applyRanking', presenter.toJSON());
    },

    setSelects: function() {
      $('#select-guideline').removeAttr('disabled', 'disabled');
      this.setSelectedPillar();
    },

    setSelectedPillar: function() {
      $('#select-pillar').select2({
        shouldFocusInput: function() { return false; },
         autofocusInputOnOpen: false
      }).select2('val', presenter.get('pillar'));
    },

    setSelectedGuideline: function() {
      var currentGuideline = presenter.get('guideline');

      if (presenter.get('pillar') !== 'all') {
        currentGuideline = parseInt(currentGuideline);
        $('#select-guideline').select2({
          shouldFocusInput: function() { return false; },
          autofocusInputOnOpen: false
        }).select2('val', currentGuideline);
      }
    },

    getPillars: function() {
      var self = this;

      this.pillarCollection.getPillars(function(){
        self.getGuidelinesByPillar();
      });
    },

    showOverall: function() {
      var self = this;
      presenter.set({
        pillar: 'all',
        guideline: null
      }, {silent: true});

      this.overallCollection.getOverallScore(function(){
          self.render();
          $('#select-guideline').attr('disabled', 'disabled');
          Backbone.Events.trigger('applyRanking', presenter.toJSON());
      });

      window.rankingRouter.navigate('#all', false);

      // this.actualizeDescription('Overall');
    },

    getGuidelinesByPillar: function() {
      var self = this;

      this.collection.getByPillar(presenter.get('pillar'), function(){
        self.render(self.collection);

        if(presenter.get('pillar') !== 'all') {
          $('#select-guideline').removeAttr('disabled', 'disabled').select2({shouldFocusInput: function() { return false; }}).select2('val', presenter.get('guideline'));
        } else {
          $('#select-guideline').attr('disabled', 'disabled');
        }
      });

      if (! presenter.get('guideline')) {
       window.rankingRouter.navigate('#' + presenter.get('pillar'), false);
      }

      Backbone.Events.trigger('applyRanking', presenter.toJSON());
    },

    render: function(collection) {
      var self = this;
      collection = collection || this.collection;

      this.$el.html(this.template({
        pillars: this.pillarCollection.toJSON(),
        guidelines: collection.toJSON()
      }));

      var guidelines = collection.toJSON();

      if(guidelines) {
        _.map(guidelines, function(guideline) {
          if(guideline.id === 7 || guideline.id === 14 || guideline.id === 25) {
            var currentGuideline = $('option[value='+ guideline.id + ']');
            currentGuideline.attr('disabled','disabled');
          }
        });
      }

      $('#select-pillar').select2({shouldFocusInput: function() { return false; }})
        .on('change', function() {
          self.savePillar();
          self.setSelectedGuideline();
        });

      $('#select-guideline').select2({shouldFocusInput: function() { return false; }})
        .on('change', function() {
          self.saveGuideline();
        });

      this.setSelectedPillar();
    },

    actualizeDescription: function(obj) {
      this.$('.ranking-description .description').html(this.btnTemplate({
        title: obj.title
      }));
    },

    fixSelectors: function() {
      var $reference = $('.layout-main-content');
      var $elementToFix = $('#ranking-selector');
      var scrollTop = $(window).scrollTop();
      var elementOffset = $reference.offset().top - 30;

      if (scrollTop > elementOffset) {
        $elementToFix.addClass('is-fix');
      } else {
        $elementToFix.removeClass('is-fix');
      }
    }
  });

  return RankingSelectorView;

});
