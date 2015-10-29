'use strict';

require.config({

  baseUrl: '/sites/all/themes/edi/scripts',

  paths: {
    jquery: '../vendor/jquery/jquery',
    jqueryui: '../lib/jquery-ui/jquery-ui',
    'jquery-validation': '../vendor/jquery-validation/dist/jquery.validate',
    chachiSlider: '../lib/chachi-slider/jquery.chachi-slider',
    handlebars: '../vendor/handlebars/handlebars',
    text: '../vendor/requirejs-text/text',
    d3: '../vendor/d3-amd/d3',
    select2: '../vendor/select2/select2',
    backbone: '../vendor/backbone/backbone',
    underscore: '../vendor/underscore/underscore',
    'underscore.string': '../vendor/underscore.string/dist/underscore.string.min',
    domReady: '../vendor/domReady/domReady'
  },

  shim: {
    jquery: {
      exports: '$'
    },
    jqueryui: {
      deps: ['jquery'],
      exports: '$'
    },
    'jquery-validation': {
      deps: ['jquery'],
      exports: '$'
    },
    chachiSlider: {
      deps: ['jquery'],
      exports: '$'
    },
    handlebars: {
      exports: 'Handlebars'
    },
    d3: {
      exports: 'd3'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    },
    'underscore.string': {
      deps: ['underscore'],
      exports: '_'
    },
    select2: {
      deps:['jquery'],
      exports: 'Select2'
    }
  }

});

require([
  'domReady',
  'jquery',
  'jqueryui',
  'jquery-validation',
  'chachiSlider',

  'underscore',
  'backbone',
  'handlebars',
  'views/main-menu',
  'views/share',
  'views/dashboard-wrapper',
  'views/tutorial-overlay',
  'views/map-breadcrumbs',
  'views/tagLineView',

  // Map
  'views/map',
  'views/dashboard',
  'views/guideline',
  'views/country-search',
  'router',

  // Ranking
  'router-ranking',
  'views/ranking-selector',
  'views/ranking-content',

  // Country
  'views/country-highlights',
  'views/country-guidelines',
  'views/country-compare',
  'router-country',

  // Compare
  'views/compare-highlights',
  'views/compare-guidelines',
  'views/compare-comments',
  'router-compare',

  // Static
  'views/about',
  'views/about-index-guidelines',
  'views/blogIndexView'
], function(domReady, $, jqueryui, jqueryValidation, chachiSlider, _, Backbone,
  Handlebars, MainMenuView, ShareView, DashboardWrapperView, TutorialOverlayView,
  MapBreadcrumbsView, TagLineView,
  MapView, GuidelinesView, DashboardView, CountrySearchView, MapRouter,
  RankingRouter, RankingSelectorView, RankingContentView,
  CountryHighlightsView, CountryGuidelinesView, CountryCompareView, RouterCountry,
  CompareHighlightsView, CompareGuidelinesView, CompareCommentsView, RouterCompare,
  AboutView, AboutIndexView, BlogIndexView
) {

  domReady(function() {
    var cleanNewsletter = function() {

      var value = $('#edit-submitted-validated-newsletter-email').val();

      $('#edit-submitted-validated-newsletter-email').on('click', function() {

        if(this.value === value) {
          this.value = '';
        }
      });

      $('#edit-submitted-validated-newsletter-email').on('blur', function() {

        if(this.value === '') {
          $('#edit-submitted-validated-newsletter-email').val(value);
        }
      });
    };

    var openAboutMenu = function () {
      $('#menu').fadeIn();
    };

    $('.menu-mlid-520').on('mouseenter', openAboutMenu);

    var closeFooter = function() {
      $('.layout-footer').animate({'height': 0}, 10, function(){
        $('.btn-more-info').css({'opacity' : 1});
      });
    };

    var openFooter = function() {
      $('.layout-footer').animate({'height': 450}, 10, function(){
        $('.btn-more-info').css({'opacity' : 0});
      });
    };

    var openChildren = function(e) {
      //$(e.currentTarget).find('.menu').css({'display': 'block'});
      $(e.currentTarget).find('.menu').toggleClass('is-visible');
    };

    var validateForm = function() {

      var labels = $('#block-webform-client-block-568 label:not(.error)');

      $('#edit-submit').on('click', function(){

        $('#webform-client-form-568').validate({
          onkeyup: false,
          onfocusout: false,
          success: function(label, elem) {
            if(elem.id === 'edit-submitted-name-and-surname') {
              $(labels[0]).prependTo('#webform-component-name-and-surname');
            }

            if(elem.id === 'edit-submitted-e-mail') {
              $(labels[4]).prependTo('#webform-component-e-mail');
            }

            if(elem.id === 'edit-submitted-message') {
              $(labels[5]).prependTo('#webform-component-message');
            }

            if(elem.id === 'edit-submitted-privacy-policy-1') {
              $('#block-system-main').removeClass('error');
            }
          },
          errorPlacement: function(err, elem) {
            if(err[0].id === 'edit-submitted-name-and-surname-error') {
              labels[0].remove();
              $(err).prependTo('#webform-component-name-and-surname');
            }

            if(elem[0].id === 'edit-submitted-e-mail') {
              labels[4].remove();
              $(err).prependTo('#webform-component-e-mail');
            }


            if(elem[0].id === 'edit-submitted-message') {
              labels[5].remove();
              $(err).prependTo('#webform-component-message');
            }

            if(elem[0].id === 'edit-submitted-privacy-policy-1') {
              $('#block-system-main').addClass('error');
            }
          },
          rules: {
            'submitted[name_and_surname]':{
              required: true
            },
            'submitted[e_mail]':{
              required: true,
              email: true
            },
            'submitted[message]':{
              required: true
            },
            'submitted[privacy_policy][&quot;true ]':{
              required: true
            }
          },
          messages: {
            'submitted[name_and_surname]':{
              required: 'Name and surname field is required.'
            },
            'submitted[e_mail]':{
              required: 'E-mail field is required.',
              email: 'Invalid email'
            },
            'submitted[message]':{
              required: 'Message field is required.'
            },
            'submitted[privacy_policy][&quot;true ]':{
              required: 'I have read and accept the Privacy policy field is required.'
            }
          }
        });
      });
    };

    // var removePhoto = function () {
    //   var src = $('.mod-landing-page img').attr('src');
    //   var height =  $(window).height() - 121 - $('.mod-main-links').height() - 80 + 'px';

    //   $('.mod-landing-page').css('height', height);
    //   $('.mod-landing-page').css('background-image', 'url(' + src + ')');
    //   $('.mod-landing-page img').remove();
    // };

    //removePhoto();

    var setHeightToSlider = function () {
      var height;

      if ($(window).height() < 600) {
        height = '500px';
      } else if ($(window).height() < 800){
        height =  $(window).height() - 121 + 'px';
      }else {
        height =  $(window).height() - 121 - $('.mod-main-links').height() - 80 + 'px';
      }

      $('#block-views-splash-block').css('height', height);
    };

    setHeightToSlider();

    var isDevice = function() {
      if ('ontouchstart' in window) {
        $('body').addClass('is-device');
      } else {
        $('body').addClass('no-device');
      }
    };

    isDevice();

    $('.layout-header-bottom li.expanded').on('click', openChildren);

    $.fn.partnersPhoto = function () {

      var ChangePhoto = function (el) {

        var $el = $(el);
        var src = $el.find('img').attr('src');
        var partnerLink = $el.find('a');

        partnerLink.css('background-image', 'url(' + src + ')');

        $el.find('img').remove();

      };

      return this.each(function(index, el) {
        new ChangePhoto(el);
      });
    };

    $('.partner-image').partnersPhoto();

    Handlebars.registerHelper('breaklines', function(text) {
      text = Handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<p>');
      return new Handlebars.SafeString(text);
    });

    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
      if(v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    // CARTODB Hacks
    cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
      handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
    });

    new MainMenuView();
    new ShareView();
    new DashboardWrapperView();
    new MapBreadcrumbsView();
    new TagLineView();

    if (document.getElementById('mapView')) {
      new MapView();
      new DashboardView();
      new GuidelinesView();
      new CountrySearchView();
      window.router = new MapRouter();

      Backbone.history.start({
        pushState: false
      });

      $('.btn-close').on('click', closeFooter);
      $('.btn-more-info').on('touchstart', openFooter);
    }

    if (document.getElementById('country-highlights')) {
      new CountryHighlightsView();
      new CountryGuidelinesView();
      new CountryCompareView();
      new RouterCountry();

      window.routerCountry = new RouterCountry();

      cleanNewsletter();

      Backbone.history.start({
        pushState: true
      });
    }

    if (document.getElementById('compare-highlights')) {
      new CompareHighlightsView();
      new CompareGuidelinesView();
      new CompareCommentsView();

      window.routerCompare = new RouterCompare();

      cleanNewsletter();

      Backbone.history.start({
        pushState: false
      });
    }

    if (document.getElementById('ranking-selector')) {
      new RankingSelectorView();
      new RankingContentView();

      window.rankingRouter = new RankingRouter();

      cleanNewsletter();

      Backbone.history.start({
        pushState: false
      });
    }

    if(document.getElementById('about-edi')) {
      new AboutView();
      cleanNewsletter();
    }

    if(document.getElementById('about-guidelines')) {
      new AboutIndexView();
      cleanNewsletter();
    }

    if (document.getElementById('countryPageSearchView')) {
      new CountrySearchView();
      cleanNewsletter();
    }

    if (document.getElementById('blogIndexView')) {
      new BlogIndexView();
    }

    if(document.getElementById('block-webform-client-block-568')) {
      validateForm();
    }

    if(document.getElementById('block-views-splash-block')) {

      new TutorialOverlayView();

      jQuery('.chachi-slider').chachiSlider({
        manualAdvance: false
      });

      jQuery('.tutorial-btn').on('click', function(e) {
         Backbone.Events.trigger('openTutorial');
         e.preventDefault();
      });
    }

  });

});


