'use strict';

define([
  'underscore',
  'backbone',
  'handlebars',
  'd3',
  'select2',
  'models/country',
  'collections/countries',
  'text!../../layouts/compare-highlights.handlebars'
], function(_, Backbone, Handlebars, d3, select2, CountryModel, CountriesCollection, tpl){

  var CompareHighlightsView = Backbone.View.extend({

    el: '#compare-highlights',
    template: Handlebars.compile(tpl),
    model: CountryModel,
    collection: new CountriesCollection(),
    events: {
      'click .btn-compare': 'setCountries',
      'click .country-detail': 'toggleDropDown'
    },

    initialize: function() {
      var self = this;
      $('#compare-highlights').addClass('csspinner');

      this.selectedCountriesCounter = 0;

      this.collection.getCountries(function(){
        self.render();

        if (CountryModel.get('countryA')) {
          self.getParams();
          self.setSelectedCountries();
          self.dataToSend = self.countriesArray;
          self.disableCountries();

          Backbone.Events.trigger('setCountries', self.dataToSend);
        }
      });

      this.compareWrapper = $('#compare-guidelines');

    },

    disableCountries: function() {
      var selectedCountries = [],
        selects = $('select');

      selects.each(function(i, elem) {
        selectedCountries.push(elem.value);
      });

      _.each(selects, function(elem) {
        var $elem = $(elem);
        $elem.find('option').removeAttr('disabled');

        _.each(selectedCountries, function(selected) {
          if ($elem.val() !== selected) {
            $elem.find('option[value=' + selected + ']').attr('disabled', 'disabled');
          }
        });
      });

      this.countriesArray = selectedCountries;
      this.drawMap();

      this.compareWrapper.html(null);
    },

    toggleDropDown: function(e) {
      var target = $(e.currentTarget).attr('selector');
      var selector = '#s2id_' + target;

      $(selector).select2('open');
    },

    setCountries: function() {
      var urlCountries = this.countriesArray;
      urlCountries =_.compact(urlCountries);

      if (urlCountries.length > 2) {
        window.routerCompare.navigate('#' + urlCountries[0] + '/' + urlCountries[1] + '/' + urlCountries[2] ,{trigger: false});
      } else {
        window.routerCompare.navigate('#' + urlCountries[0] + '/' + urlCountries[1] ,{trigger: false});
      }

      Backbone.Events.trigger('setCountries', this.dataToSend);
    },

    setSelectedCountries: function() {
      var selects = $('select');

      for (var i = 0; i < selects.length; i++) {
        if(this.countriesArray[i]) {
          $('#' + selects[i].id).select2('val', this.countriesArray[i]).attr('selected', 'selected');
        }
      }

      for (i = 0; i < selects.length; i++) {
        for (var x = i + 1 ; x < selects.length; x++) {
          if(selects[x] && selects[i].value === selects[x].value) {
            for(var z = 0; z < this.countriesArray.length; z++) {
              if (this.countriesArray[z] === selects[x].value) {
                this.countriesArray[z] = '';
              }
            }
            selects[i].selectedIndex = 0;
            selects[x].selectedIndex = 0;
          }
        }
      }
    },

    drawMap: function() {
      var self = this;

      this.wrappers = $('.country-figure');

      $(this.wrappers[0]).empty().parent().css({'background' : 'none'}).addClass('csspinner');
      $(this.wrappers[1]).empty().parent().css({'background' : 'none'}).addClass('csspinner');
      $(this.wrappers[2]).empty().parent().css({'background' : 'none'}).addClass('csspinner');

      var url = function(iso) {
        return 'http://edi.cartodb.com/api/v2/sql?q=SELECT the_geom FROM countries WHERE adm0_a3 LIKE UPPER(\''+ iso +'\') &format=geojson';
      };

      $.when(
        $.get(url(this.countriesArray[0])),
        $.get(url(this.countriesArray[1])),
        $.get(url(this.countriesArray[2]))
      ).then(function(jsonA, jsonB, jsonC) {

        self.drawCountry(jsonA[0], '#country-figureA', self.countriesArray[0]);
        self.drawCountry(jsonB[0], '#country-figureB', self.countriesArray[1]);
        self.drawCountry(jsonC[0], '#country-figureC', self.countriesArray[2]);

        if (jsonA[0].features.length > 0) {
          self.selectedCountriesCounter++;
        } else {
          $(self.wrappers[0]).parent().css({'background': 'url("../sites/all/themes/edi/images/select-country-bg.png") no-repeat center'});
        }

        if (jsonB[0].features.length > 0) {
          self.selectedCountriesCounter++;
        } else {
          $(self.wrappers[1]).parent().css({'background': 'url("../sites/all/themes/edi/images/select-country-bg.png") no-repeat center'});
        }

        if (jsonC[0].features.length > 0) {
          self.selectedCountriesCounter++;
        } else {
          $(self.wrappers[2]).parent().css({'background': 'url("../sites/all/themes/edi/images/select-country-bg.png") no-repeat center'});
        }

        if(self.selectedCountriesCounter >= 2) {
          $('.btn-compare')
            .removeClass('disabled')
            .removeAttr('disabled')
            .on('click', self.scroll);
        } else {
          $('.btn-compare')
            .addClass('disabled')
            .attr('disabled', 'disabled');
        }

        self.selectedCountriesCounter = 0;
        self.dataToSend = self.countriesArray;
      });
    },

    scroll: function() {
      $('html, body').animate({
        scrollTop: $('#compare-guidelines').offset().top - 50
      }, 300);
    },

    drawCountry: function(json, divId, iso) {
      var width = $('.country-figure-wrapper').width(),
        height = $('.country-figure-wrapper').height();

      var vis = d3.select(divId).append('svg');

      var scale = 100;

      var projection = d3.geo.mercator()
        .scale(scale)
        .translate([width/2, height/2]);

      var path = d3.geo.path().projection(projection);

      var bounds = path.bounds(json),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1];

      if (iso === 'USA') {
        dx = 200;
        dy = 150;
      }

      if (iso === 'CHL') {
        dx = 150;
        dy = 90;
      }

      if (iso === 'ZAF') {
        dx = 30;
        dy = 30;
      }

      if (iso === 'RUS') {
        dx = 1000;
        dy = 200;
      }

      if (iso === 'CRI') {
        dx = 9;
        dy = 5;
      }

      if (iso === 'ECU') {
        dx = 47;
      }

      if (iso === 'GBR') {
        dx = 35;
      }

      if (iso === 'VEN') {
        dy = 35;
      }

      var newCenter = [bounds[0][0] + (dx / 2), bounds[0][1] + (dy / 2)];
      var _scale = scale * Math.min(width/dx, height/dy);

      if (iso === 'RUS') {
        _scale = 3 * _scale;
      }

      if (iso === 'CHL') {
        _scale = 1.75 * _scale;
      }

      if (iso === 'ECU') {
        _scale = 3 * _scale;
      }

      if (iso === 'VEN') {
        _scale = 1.2 * _scale;
      }

      projection
        .center(projection.invert(newCenter))
        .scale(_scale * 0.9);

      vis.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path);

      $(divId).parent().removeClass('csspinner');
    },

    getParams:function() {
      var self = this,
        data = this.model.toJSON();

      this.countriesArray = [];

      _.map(data, function(country) {
        self.countriesArray.push(country);
      });
    },

    render: function() {

      var self = this;
      var countries = this.collection.toJSON();
      var sortedCountries = _(countries).sortBy('country');

      this.$el.html(this.template({
        countries : sortedCountries
      }));

      $('#compare-highlights').removeClass('csspinner');

      $('#countryA').select2({
        shouldFocusInput: function() { return false; },
        autofocusInputOnOpen: false
      })
      .on('change', function() {
        self.disableCountries();
      });

      $('#countryB').select2({
        shouldFocusInput: function() { return false; },
        autofocusInputOnOpen: false
      })
      .on('change', function() {
        self.disableCountries();
      });

      $('#countryC').select2({
        shouldFocusInput: function() { return false; },
        autofocusInputOnOpen: false
      })
      .on('change', function() {
        self.disableCountries();
      });

      $('.btn-compare').attr('disabled', 'disabled');
    }

  });

  return CompareHighlightsView;

});
