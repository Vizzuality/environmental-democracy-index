'use strict';

define(['backbone'], function(Backbone) {

  var Presenter = Backbone.Model.extend({
    defaults: {
      pillar: null,
      guideline: null,
      indicator: null,
      type: null
    }
  });

  return new Presenter();

});
