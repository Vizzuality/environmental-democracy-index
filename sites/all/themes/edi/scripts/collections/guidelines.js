'use strict';

define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var GuidelinesCollections = Backbone.Collection.extend({

    url: function() {
      return '/guidelines-by-pillar/' + this.currentPillarId;
    },

    parse: function(data) {
      var self;
      self = this;
      return _.map(data, function(d) {
        return {
          id: +d.Number,
          pillar: self.currentPillarId,
          name: d.Question,
          description: d.description
        };
      });
    },

    getByPillar: function(pillarId, callback) {
      var onError, onSuccess;
      this.currentPillarId = pillarId;
      onSuccess = function(collection) {
        if (typeof callback === 'function' && callback) {
          return callback(undefined, collection);
        }
      };
      onError = function(xhr, err) {
        if (typeof callback === 'function' && callback) {
          return callback(err);
        }
      };

      this.reset();

      this.fetch({
        dataType: 'json',
        success: onSuccess,
        error: onError
      });
    }
  });
  return GuidelinesCollections;
});
