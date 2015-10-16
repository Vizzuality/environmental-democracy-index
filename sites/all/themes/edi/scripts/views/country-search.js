'use strict';

define([
  'underscore',
  'backbone',
  'collections/countries'
], function(_, Backbone, CountriesCollection) {

  var CountrySearchView = Backbone.View.extend({

    el: '#countrySearchView',

    collection: new CountriesCollection(),

    events: {
      'focus': 'onFocus',
      'blur': 'onBlur',
      'touchstart': 'hide',
      'keydown': 'onChange'
    },

    blurFromMap: function() {
      $('#mapView').on('touchstart', function() {
        if($('.country-search-view').hasClass('is-active')) {
          $('.country-search-view input').val('').parent().removeClass('is-active');
        }
      });
    },

    initialize: function() {
      this.$el.val('');
      this.blurFromMap();

      if (this.$el.hasClass('.map-search')) {
        this.collection.getCountries(_.bind(function() {
        this.$el.autocomplete({
          position: {
            my: 'left top',
            at: 'left bottom'
          },
          source: _.map(this.collection.toJSON(), function(item) {
            return {
              label: item.country,
              value: item.field_iso
            };
          }),
          select: function(e, ui) {
            $(e.currentTarget).val('');
            window.location.href = '/country/' + ui.item.value;
          }
        });
      }, this));
      } else {
        this.collection.getCountries(_.bind(function() {
          this.$el.autocomplete({
            position: {
              my: 'center top',
              at: 'center bottom'
            },
            source: _.map(this.collection.toJSON(), function(item) {
              return {
                label: item.country,
                value: item.field_iso
              };
            }),
            select: function(e, ui) {
              $(e.currentTarget).val('');
              window.location.href = '/country/' + ui.item.value;
            }
          });
        }, this));
      }
    },

    hide: function() {
      $('.country-search-view').toggleClass('is-active');
    },

    onFocus: function(e) {
      $(e.currentTarget).parent().addClass('is-active');
    },

    onBlur: function(e) {
      $(e.currentTarget).val('').parent().removeClass('is-active');
    },

    onChange: function(e) {
      if(e.keyCode === 13) {
        var value = $(e.currentTarget).val();
        var countries = this.collection.toJSON();
        value = value.toLowerCase();
        _.each(countries, function(country) {

          if(value === country.country.toLowerCase()) {
            value = country.field_iso;
          }

          if(value === country.field_iso.toLowerCase()) {
            value = value.toUpperCase();
          }

        });
      history.pushState('', document.title, window.location.pathname);
      window.location.pathname = '/country/' + value;
        $(e.currentTarget).val('');
        e.preventDefault();
      }
    }

  });

  return CountrySearchView;

});
