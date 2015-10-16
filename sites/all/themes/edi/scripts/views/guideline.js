'use strict';

define([
  'underscore',
  'backbone',
  'presenter',
  'handlebars',
  'collections/indicator',
  'views/guideline-overlay',
  'views/indicator-overlay',
  'views/indicator-type-overlay',
  'text!../../layouts/indicators.handlebars'
], function(_, Backbone, presenter, Handlebars, IndicatorCollection, GuidelineOverlay, IndicatorOverlay, IndicatorTypeOverlay, tpl) {

  var GuidelinesView = Backbone.View.extend({

    el: '.guidelines',
    template: Handlebars.compile(tpl),
    collection: new IndicatorCollection(),

    events: {
      'click .indicator': 'drawMapByIndicatorScore',
      'click .more-info-guideline' : 'setGuidelineOverlay',
      'click .more-info-indicator' : 'setIndicatorOverlay',
      'click .more-info-type-indicator': 'setIndicatorTypeOverlay',
      'click .open-guideline-btn' : 'navigate',
      'click .guideline' : 'checkGuidelines'
    },

    initialize: function() {
      presenter.on('change:indicator', this.checkIndicators, this);
      Backbone.Events.on('dashboard:load', this.checkGuidelines, this);
    },

    navigate: function(ev) {
      var pillar = $(ev.currentTarget).data('pillar') || presenter.get('pillar');
      var guideline = $(ev.currentTarget).data('guideline') || presenter.get('guideline');

      this.$currentGuideline = $('#guideline-' + guideline);

      if (this.$currentGuideline.hasClass('is-open')) {
        this.hideIndicators();
        this.$el.removeClass('is-open');
      } else {

        window.router.navigate('#' + pillar + '/' + guideline, { trigger: true });

        this.checkGuidelines();
        this.$el.removeClass('is-selected');
        this.$el.removeClass('is-open');
        this.$currentGuideline.addClass('is-open');
        this.$currentGuideline.addClass('is-selected');
      }
    },

    scrollGuideline: function() {
      var $wrapper = $('.guidelines-wrapper');
      var wrapperOffset = $wrapper.offset().top;

      var targetOffset = this.$currentGuideline.offset().top;

      if (targetOffset === 0) {
        targetOffset = localStorage.getItem('scrollValue');
      } else {
        localStorage.setItem('scrollValue', targetOffset);
      }

      var scrollTo = targetOffset - wrapperOffset;

      $wrapper.animate({
        scrollTop: scrollTo
      }, 100);
    },

    updateElement: function() {
      this.setElement('.guidelines');
    },

    checkGuidelines: function() {
      var guideline = presenter.get('guideline');
      var indicator = presenter.get('indicator');

      this.$currentGuideline = $('#guideline-' + guideline);
      var isOpen = this.$currentGuideline.hasClass('is-open');

      if ($(this.$currentGuideline).length > 0) {
        this.currentScrollTop = this.$currentGuideline.offset().top;
      }

      if (!isOpen) {
        this.updateElement();

        if (!guideline || indicator) {
          return this.checkIndicators();
        }

        this.$el.removeClass('is-selected');
        this.$el.removeClass('is-open');
        this.$currentGuideline.addClass('is-selected');
        this.$currentGuideline.parent().addClass('csspinner');
        this.toggleIndicators();
        if (this.$currentGuideline.length > 0) {
          _(function() {
              this.scrollGuideline();
          }).chain().bind(this).delay(500);
        }
      }
    },

    checkIndicators: function() {
      var guideline = presenter.get('guideline');
      var indicator = presenter.get('indicator');

      if (!indicator) {
        return;
      }

      this.$currentGuideline = $('#guideline-' + guideline);
      this.$currentGuideline.addClass('is-open');

      this.showIndicators();
    },

    toggleIndicators: function() {
      var $guideline = $('#guideline-' + presenter.get('guideline'));

      $('.guidelines-tabs').find('.tab-link').removeClass('is-current');

      this.$el.find('.indicator').remove();
      this.$el.removeClass('is-open');
      this.$el.find('.open-guideline-btn').removeClass('is-open').removeClass('is-selected');

      $guideline.addClass('is-open');

      if ($guideline.hasClass('is-open')) {
        this.$currentGuideline = $guideline;
        this.collection.getByGuideline(presenter.get('pillar'), $guideline.data('guideline'), _.bind(function() {
          this.render();
        }, this));
      }
    },

    showIndicators: function() {
      var pillar = presenter.get('pillar');
      var guideline = presenter.get('guideline');

      presenter.set('guideline', guideline);

      this.collection.getByGuideline(pillar, guideline, _.bind(function() {
        this.render();
      }, this));
      $('.guidelines-tabs').find('.tab-link').removeClass('is-current');
    },

    hideIndicators: function() {
      this.$el.find('.indicators').remove();
    },

    drawMapByIndicatorScore: function(ev) {
      var $indicator = $(ev.currentTarget);

      $('.indicator').removeClass('is-current');
      $indicator.addClass('is-current');

      window.router.navigate($indicator.data('url'), true);

      _(function() {
          this.scrollGuideline();
      }).chain().bind(this).delay(500);
    },

    setGuidelineOverlay: function(evt) {
      evt.preventDefault();
      var id;

      if (presenter.get('guideline')) {
        id = presenter.get('guideline');
      } else {
        id = $(evt.currentTarget).siblings('.open-guideline-btn').attr('data-guideline');
      }

      GuidelineOverlay.setData(id);
    },

    setIndicatorOverlay: function(evt) {
      evt.preventDefault();

      var li = $(evt.currentTarget).closest('li');
      var indicatorNumber = li.data('number');
      var indicatorType = li.data('type');

      IndicatorOverlay.setData(indicatorNumber, indicatorType, presenter.get('guideline'));
    },

    setIndicatorTypeOverlay: function(evt) {
      evt.preventDefault();

      var type = $(evt.currentTarget).attr('data-type');
      IndicatorTypeOverlay.render(type);
    },

    render: function() {
      var indicators = this.collection.toJSON();
      var indicatorsLaw = indicators.Law || null;
      var indicatorsPractice = indicators.Practice || null;

      this.$currentGuideline.parent().removeClass('csspinner');

      this.$el.find('.indicators').remove();

      this.$currentGuideline.append(this.template({
        pillar: presenter.get('pillar'),
        guideline: presenter.get('guideline'),
        indicatorsLaw : indicatorsLaw,
        indicatorsPractice : indicatorsPractice
      }));

      if($.isEmptyObject(indicators)) {
        this.$currentGuideline.find('.indicators').remove();
      }

      this.$el.find('.indicators').removeClass('is-current');

      $('#indicator-' + presenter.get('indicator')).addClass('is-current');

      Backbone.Events.trigger('indicators:load');
    }
  });

  return GuidelinesView;
});
