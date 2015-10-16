'use strict';

define([
  'backbone',
  'handlebars',
  'text!../../layouts/indicator-law-overlay.handlebars',
  'text!../../layouts/indicator-practice-overlay.handlebars'
], function(Backbone, Handlebars, tplLaw, tplPractice) {

  var IndicatorTypeOverlay = Backbone.View.extend({

    el: 'body',

    templateLaw: Handlebars.compile(tplLaw),
    templatePractice: Handlebars.compile(tplPractice),

    events: {
      'touchstart .close' : 'closePopup',
      'touchstart .overlay-bg' : 'closePopup',

      'click .close' : 'closePopup',
      'click .overlay-bg' : 'closePopup'
    },

    closePopup: function(){
      $('#overlay').remove();
      $('body, html').removeClass('is-overflow-hidden');
    },

    render: function(type) {
      if (type === 'Law') {
        this.$el.append(this.templateLaw({}));
      } else if (type === 'Practice') {
        this.$el.append(this.templatePractice({}));
      }

      $('body, html').addClass('is-overflow-hidden');
    }

  });

  return new IndicatorTypeOverlay();

});
