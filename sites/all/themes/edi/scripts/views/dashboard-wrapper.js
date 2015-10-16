'use strict';

define([
	'backbone'
], function(Backbone){

	var DashboardWrapperView = Backbone.View.extend({

		el: '#overall-wrapper',

		events: {
			'mouseover .pop-up-index' : '_showYourPop',
      'mouseout .pop-up-index' : '_hideYourPop'
		},

		_showYourPop: function(ev) {

			var target = $(ev.currentTarget).attr('id'),
          popUp,
          actualTop;

      var elementPosition = $(ev.currentTarget).offset().top;
      var documentPosition = $(document).height();

      if (target === 'country-level' && elementPosition < documentPosition) {
        popUp = '<div class="pop-up country-level"> \
                  <div class="close"></div> \
                  <h3>Country level</h3> \
                  <span>70 Countries</span> \
                  <p>Transparency, Participation, and Justice Pillar scores averaged to create overall country score</p> \
                </div>';
        actualTop = $(ev.currentTarget).offset().top + 10 + 'px';
      } else if (target === 'pillar-level' && elementPosition < documentPosition) {
        popUp = '<div class="pop-up pillar-level"> \
                  <div class="close"></div> \
                  <h3>Pillar level</h3> \
                  <span>3 Pillars</span> \
                  <p>Guideline scores averaged for each pillar</p> \
                </div>';
        actualTop = $(ev.currentTarget).offset().top + 10 + 'px';
      } else if (target === 'guideline-level' && elementPosition < documentPosition) {
        popUp = '<div class="pop-up guideline-level"> \
                  <div class="close"></div> \
                  <h3>Guideline level</h3> \
                  <span>23 Guidelines</span> \
                  <p>EDI indicators were developed under the United Nations Environment Programme\'s (UNEP) Bali Guidelines on Rio Principle 10.</p> \
                  <p>These guidelines were adopted by UNEP in 2010.</p> \
                  <p>Guideline scores are the arithmetic average of its legal indicators.</p>\
                </div>';
        actualTop = $(ev.currentTarget).offset().top + 'px';
      } else if (target === 'indicator-level' && elementPosition < documentPosition) {
        popUp = '<div class="pop-up indicator-level"> \
                  <div class="close"></div> \
                  <h3>Indicator level</h3> \
                  <span>75 legal indicators</span> \
                  <p>Individual indicator score</p> \
                </div>';
        actualTop = $(ev.currentTarget).offset().top +'px';
      } else if ((target === 'practice-level' && elementPosition < documentPosition)) {
        popUp = '<div class="pop-up practice-level"> \
                  <div class="close"></div> \
                  <h3>Practice indicators</h3> \
                  <span>24 supplemental indicators on environmental democracy in practice.</span> \
                  <p> Results do not affect the legal indicator scores.</p> \
                </div>';
        actualTop = 'auto';
      }

      $('body').append(popUp);
      $('.pop-up').css('top', actualTop);
      $('.close').on('touchstart', this._hideYourPop);
		},

    _hideYourPop: function () {
      $('.pop-up').remove();
    }

	});

	return DashboardWrapperView;

});
