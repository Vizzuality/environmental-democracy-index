'use strict';

define([
  'underscore',
  'backbone',
  'handlebars',
  'select2',
  'models/country',
  'collections/countries',
  'text!../../layouts/country-compare.handlebars'
], function(_, Backbone, Handlebars, select2, CountryModel, CountriesCollection, tpl) {

  var CountryCompareView = Backbone.View.extend({

    el: '#country-compare',

    model: CountryModel,
    collection: new CountriesCollection(),

    events:{
      'change select': 'disableCountries',
      'click input[type="submit"]': 'send'
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.getCountries();
    },

    behavoirCompareBtn: function() {
      var selects,
        compareBtn;

      selects = $('select');
      compareBtn = $('input[type="submit"]');

      compareBtn.addClass('disabled');
      compareBtn.attr('disabled', 'disabled');

      for (var i = 0; i < selects.length; i++) {
        if(!selects[i].options[0].selected) {
          compareBtn.removeClass('disabled');
          compareBtn.removeAttr('disabled');
        }
      }
    },

    disableCountries: function() {
      var countriesSelected = [];
      var selects = $('.select');

      selects.each(function(i, elem) {
        countriesSelected.push(elem.value);
      });

      _.each(selects, function(elem) {
        var $elem = $(elem);
        $elem.find('option').removeAttr('disabled');

        _.each(countriesSelected, function(selected) {
          if (selected !== '' && $elem.val() !== selected) {
            $elem.find('option[value=' + selected + ']').attr('disabled', 'disabled');
          }
        });
      });

      this.behavoirCompareBtn();
    },

    send: function(ev) {
      ev.preventDefault();

      var countryA = CountryModel.get('iso').toUpperCase();
      var countries = [];

      _.each($('.select'), function(select){
        countries.push($(select).val());
      });

      countries = _.compact(countries);

      if (countries[1]) {
        window.location.href = '/compare-countries#'+ countryA + '/' + countries[0] + '/' + countries[1];
      } else {
        window.location.href = '/compare-countries#'+ countryA + '/' + countries[0];
      }

    },

    getCountries: function() {
      var self = this;

      this.collection.getCountries(function(){
        self.render();
        //self.disableCountries();
      });
    },

    render: function() {
      var countries,
        self = this;

      countries = this.collection.toJSON();

      countries = _.reject(countries, function(country) {
        return self.model.get('iso').toUpperCase() === country.field_iso;
      });

      this.$el.html(this.template({
        iso: this.model.get('iso'),
        countries: countries
      }));

      $('#countryB').select2({shouldFocusInput: function() { return false; }})
      .on('change', function(){
        self.disableCountries();
      });

      $('#countryC').select2({shouldFocusInput: function() { return false; }})
      .on('change', function(){
        self.disableCountries();
      });
    }

  });

  return CountryCompareView;

});
