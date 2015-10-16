'use strict';

define([
  'underscore',
	'backbone',
  'd3',
  'handlebars',
  'collections/inPracticeScore',
  'text!../../layouts/chart-legend-tpl.handlebars'
], function(_, Backbone, d3, Handlebars, model, tpl){

	var ChartView = Backbone.View.extend({

    model: model,
    template: Handlebars.compile(tpl),

		initialize: function(obj) {
      var self = this;
      this.country = obj.country;

      this.countryName = obj.countryName ? obj.countryName : null;

      this.model.getPracticeIndicatorScore(this.country, function(){
        var practiceTotalScores = self.model.toJSON();
        self.formatData(practiceTotalScores);
      });
    },

    formatData: function(scores) {
      var nodes = _.pluck(scores.nodes, 'node');
      var formatedData = [];
      var practicalIndicatorsCode = {
        'score-2': 'YES',
        'score-1': 'LIMITED',
        'score-0': 'NO'
      };

      $.each(nodes, function() {
        var data = {
          score: 'score-' + this.score,
          count: this.count,
          code: practicalIndicatorsCode['score-' + this.score]};
        formatedData.push(data);
        return formatedData;
      });

      this.drawChart(formatedData);
      this.setLegend(formatedData);
    },

    drawChart: function(formatedData) {

      var dataset = formatedData;
      var parentWidth = this.$el.width();
      var parentHeight = this.$el.height();

      var minimum = Math.min(parentWidth, parentHeight);

      var radius = minimum / 2;
      var width = minimum;
      var height = minimum;
      var donutWidth = minimum / 6;  //pie width

      var innerRadius = this.$el.attr('data-radius') ? 0 : radius - donutWidth;
      var colors = {
        'score-0': '#E1BD08',
        'score-1': '#F8E969',
        'score-2': '#ABD7F9'
      };

      var svg = d3.select(this.el)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +
          ',' + (height / 2) + ')');

      var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

      var pie = d3.layout.pie()
        .value(function(d) { return d.count; })
        .sort(null); //order items

      svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d) {
          var score = d.data.score;
          var color = colors[score];
          return color;
        });

      this.$el.removeClass('csspinner');
    },

    setLegend: function(formatedData) {

      var title = this.$el.attr('data-radius') ? true : false;

      this.$el.append(this.template({
        'countryName': this.countryName,
        data: formatedData,
        title: title,
        iso: this.country
      }));
    }

	});

	return ChartView;

});
