'use strict';

define([
  'backbone'
], function(Backbone){

  var MainMenuView = Backbone.View.extend({
    el: '.open-submenu',

    events: function() {
      if (window.ontouchstart) {
        return  {
          'touchstart' : 'openSubmenu'
        };
      }
      return {
        'click' : 'openSubmenu'
      };
    },

    initialize: function() {
      this.$menu = $('.menu');
    },

    openSubmenu: function () {
      this.$menu.toggleClass('small-is-visible');
      $('body, html').toggleClass('is-overflow-hidden');
    }

  });

  return MainMenuView;

});
