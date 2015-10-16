'use strict';
define([
	'backbone'
], function(Backbone){

	var PillarCollection = Backbone.Collection.extend({

		url: function() {
			return '/pillars';
		},

		getPillars: function(callback) {
      var onError, onSuccess;
      onSuccess = function(collection) {
        if (typeof callback === 'function' && callback) {
          return callback(void 0, collection);
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

	return PillarCollection;

});