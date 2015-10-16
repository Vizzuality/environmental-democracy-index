'use strict';

define([
  'jquery',
  'backbone',
  'handlebars',
  'presenter',
  'underscore',
  'underscore.string',
  'views/definition-overlay',
  'text!../../queries/overall-scores.pgsql',
  'text!../../queries/pillar-scores.pgsql',
  'text!../../queries/guideline-scores.pgsql',
  'text!../../queries/indicator-scores.pgsql',
  'text!../../layouts/info-window.handlebars',
  'text!../../cartocss/carto.css',
], function($, Backbone, Handlebars, presenter, _, _s, DefinitionOverlay,
  overallQuery, pillarQuery, guidelineQuery, indicatorQuery, tpl, CARTOCSS) {

  var minimunZoom = $('body').hasClass('no-device') ? '2' : '0';

  var MapView = Backbone.View.extend({

    options: {
      map: {
        center: [39.1, 4.5],
        zoom: 2,
        zoomControl: false,
        minZoom: minimunZoom,
        scrollWheelZoom: true,
        worldCopyJump: true
      },
      zoomControl: {
        position: 'topright'
      },
      cartodb: {
        user_name: 'edi',
        type: 'cartodb',
        noWrap: true,
        sublayers: [{
          sql: overallQuery,
          cartocss: CARTOCSS,
          interactivity: 'iso, score, name, federal'
        }]
      },
      tooltip: {
        position: {
          my: 'left+5 center',
          at: 'right center'
        }
      }
    },

    el: '#mapView',

    initialize: function() {
      this.$legendGlobal = $('.legend-global');
      this.$legendPractice = $('.legend-indicator-practice');
      this.$legendInfo = $('.legend-info-btn');

      this.$legendInfo.tooltip(this.options.tooltip);
      this.$legendGlobal.find('.legend-btn').tooltip(this.options.tooltip).on('click', this.disableClick);
      this.$legendPractice.find('.legend-btn').tooltip(this.options.tooltip).on('click', this.disableClick);
      this.createMap();

      presenter.on('change:pillar change:guideline change:indicator', this.manageLayer, this);
      Backbone.Events.on('dashboard:load indicators:load', this.checkLegend, this);
    },

    manageLayer: function() {
      $('.cartodb-infowindow').css({'display':'none'});

      if (presenter.get('pillar') === 'all' || presenter.get('pillar') === null) {
        return this.drawMapByOverallScore();
      }

      if (presenter.get('indicator')) {
        return this.drawMapByIndicatorScore();
      }

      if (presenter.get('guideline')) {
        return this.drawMapByGuidelineScore();
      }

      if (presenter.get('pillar')) {
        return this.drawMapByPillarScore();
      }
    },

    checkLegend: function() {
      var type = $('#indicator-' + presenter.get('indicator')).data('type');

      if (type && type === 'Practice') {
        this.$legendPractice.removeClass('is-hidden');
        this.$legendGlobal.addClass('is-hidden');
      } else {
        this.$legendPractice.addClass('is-hidden');
        this.$legendGlobal.removeClass('is-hidden');
      }
    },

    drawMapByOverallScore: function() {
      var applyLayer = function() {
        this.currentLayer.setSQL(overallQuery);
      };

      if (!this.currentLayer) {
        this.addLayer(_.bind(applyLayer, this));
      } else {
        applyLayer.apply(this);
      }
    },

    drawMapByPillarScore: function() {
      var query = _s.sprintf(pillarQuery, presenter.get('pillar'));
      var applyLayer = function() {
        this.currentLayer.setSQL(query);
      };

      if (!this.currentLayer) {
        this.addLayer(_.bind(applyLayer, this));
      } else {
        applyLayer.apply(this);
      }
    },

    drawMapByGuidelineScore: function() {
      var query = _s.sprintf(guidelineQuery, presenter.get('guideline'));
      var applyLayer = function() {
        this.currentLayer.setSQL(query);
        this.currentLayer.set({interactivity: 'iso, score, name, federal'});
      };

      if (!this.currentLayer) {
        this.addLayer(_.bind(applyLayer, this));
      } else {
        applyLayer.apply(this);
      }
    },

    drawMapByIndicatorScore: function() {
      var query = _s.sprintf(indicatorQuery, presenter.get('indicator'));

      var applyLayer = function() {
        this.currentLayer.setSQL(query);
        this.currentLayer.set({interactivity: 'iso, score, name, type, federal'});
      };

      if (!this.currentLayer) {
        this.addLayer(_.bind(applyLayer, this));
      } else {
        applyLayer.apply(this);
      }
    },

    createMap: function() {
      this.map = L.map(this.el, this.options.map);
      return this.map.addControl(L.control.zoom(this.options.zoomControl));
    },

    addLayer: function(callback) {
      var onDone, onError, self = this;

      onDone = function(layer) {
        var infoWindow;

        self.currentLayer = layer.getSubLayer(0);

        infoWindow = cdb.vis.Vis.addInfowindow(self.map, self.currentLayer,

          self.options.cartodb.sublayers[0].interactivity, {
            infowindowTemplate: tpl,
            templateType: 'handlebars'
          }
        );

        self.addClicksToFederal();

        infoWindow.model.on('change:latlng', function() {
          self.addClicksToFederal();
        });

        if (callback && typeof callback === 'function') {
          callback(self.currentLayer);
        }
      };

      onError = function(error) {
        throw error;
      };

      cartodb
        .createLayer(this.map, this.options.cartodb)
        .addTo(this.map)
        .on('done', onDone)
        .on('error', onError);
    },

    addClicksToFederal: function() {
      $('.cartodb-popup').on('click', '.btn-federal-info', function () {
        this.overlay = new DefinitionOverlay({ federal: true });
      });
    },

    disableClick: function(e) {
      e.preventDefault();
    }
  });

  Handlebars.registerHelper('round-score', function(content) {
    var roundScore;

    if (content <= 0.75) {
      roundScore = 'score-1';
    } else if (content > 0.75 && content <= 1.50) {
      roundScore = 'score-2';
    } else if (content > 1.50 && content <= 2.25) {
      roundScore = 'score-3';
    } else if (content > 2.25) {
      roundScore = 'score-4';
    }

    return new Handlebars.SafeString(
      roundScore
    );
  });

  return MapView;
});
