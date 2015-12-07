var dataset = [[2014,  2100], 2014, 2100]
  , arrayLength = dataset.length // Placeholder data
  , allValues = [];

// TOOLTIP TEMPLATE. CODE FOR TEMPLATE ON THE HTML TEMPLATE PAGE
var template = _.template(d3.select('#timeline-tooltip-template').html());  

console.log('template: ' + template);

for (var i = 0; i < arrayLength; i++) {
    if(isNaN(dataset[i]) == false) { allValues.push(dataset[i]) }
        else { allValues.push(dataset[i][0]); allValues.push(dataset[i][1])}
};

// Set min value as either 2000, or the smallest given value.
if ( d3.min(allValues) < 2000 ) { var min = d3.min(allValues) } 
else { var min = 2000 };

// Set max value as either 2015, or largest given value. 
if ( d3.max(allValues) > 2015 ) { var max = d3.max(allValues) } 
else { var max = 2015 };

var margins = 20
  , width = parseInt(d3.select('#timeline').style('width'))
  , height = parseInt(d3.select('#timeline').style('height')) - margins*2;

var xScale = d3.scale.linear()
                .domain([min, max])
                .range([0, width - margins*2]);

var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickFormat(d3.format("d"));           

var svg = d3.select('#timeline').append('svg')
        .attr('width', width)
        .attr('height', height);

svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('fill', function(d) {
        if(isNaN(d) == false) { return 'black'; }
            else { return '#57C3EC' } ;
    })
    .attr('x', function(d) {
        if(isNaN(d) == false) { return xScale(d); }
            else { return xScale(d[0]) } ;
    })
    .attr('y', margins*2)
    .attr('height', 30)
    .attr('width', function(d) {
        if(isNaN(d) == false) { return 2; }
            else { return xScale(d[1]) - xScale(d[0]) }
    });

svg.append('g')
    .attr('class', 'axis')
    .attr("transform", "translate(0," + (height - margins) + ")")
    .call(xAxis);

d3.select('rect').on('mouseover', tooltipShow)
        .on('mouseout', tooltipHide);

d3.select(window).on('resize.timeline', resizeTimeline);

function resizeTimeline() {
    console.log('Timeline resize firing!')

    var margins = 20
      , width = parseInt(d3.select('#timeline').style('width'))
      , height = parseInt(d3.select('#timeline').style('height')) - margins*2;

    console.log('width: ' + width);

  var xScale = d3.scale.linear()
                .domain([min, max])
                .range([0, width - margins*2]);

  var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickFormat(d3.format("d"));           

    svg
        .attr('width', width)
        .attr('height', height);

    svg.selectAll('rect')
        .attr('x', function(d) {
            if(isNaN(d) == false) { return xScale(d); }
                else { return xScale(d[0]) } ;
        })
        .attr('width', function(d) {
            if(isNaN(d) == false) { return 2; }
                else { return xScale(d[1]) - xScale(d[0]) }
        });

    svg.select('.axis')
        .attr("transform", "translate(0," + (height - margins) + ")")
        .call(xAxis);              

};

function tooltipShow(d, i) {
    console.log('tooltip firing!');
    var datum = dataset[d];
    if (!datum) return;

    $(this).tooltip({
        title: template(datum),
        html: true,
        container: svg.node().parentNode,
        placement: 'auto'
    }).tooltip('show');
}

function tooltipHide(d, i) {
    console.log('tooltip hiding!');
    $(this).tooltip('hide');
}
