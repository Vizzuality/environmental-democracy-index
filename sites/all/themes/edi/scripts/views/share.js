'use strict';
define([
  'backbone'
], function(Backbone){

  var ShareView = Backbone.View.extend({

    el: '#block-social-share-social-share',

    events: {
      'click .social-share-twitter' : 'hackUrl',
      'click .social-share-facebook' : 'hackUrl'
    },

    hackUrl: function(e) {

      var hash = encodeURIComponent(document.location.hash),
          newUrl,
          urlArray;

      if ($(e.currentTarget).hasClass('social-share-twitter')) {
        this.originalUrlTw = this.originalUrlTw || $(e.currentTarget).attr('href');
        urlArray = this.originalUrlTw .split('&text');
        newUrl = urlArray[0] + hash + '&text' + urlArray[1];
      } else {
        this.originalUrlFb = this.originalUrlFb || $(e.currentTarget).attr('href');
        urlArray = this.originalUrlFb.split('&t');
        newUrl = urlArray[0] + hash + '&t' + urlArray[1];
      }

      $(e.currentTarget).attr('href', newUrl);
    }

  });

  return ShareView;

});
