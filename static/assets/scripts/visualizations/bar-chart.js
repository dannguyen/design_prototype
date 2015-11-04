var url = "/static/assets/scripts/visualizations/maps/bachelors-degrees2.csv"
  , margin = {top: 30, right: 10, bottom: 30, left: 20}
  , width = parseInt(d3.select('#bar-chart').style('width'), 10)
  , width = width - margin.left - margin.right
  , height = width // placeholder
  , spacing = 5
  , breakPoint = 992
  , barHeight = height / 10
  , percent = d3.format('%');


// scales and axes
var x = d3.scale.linear()
    .range([0, width])
    .domain([0, .25]); // hard-coding this because I know the data

var colors = d3.scale.quantize()
    .range(colorbrewer.Blues[7]);    

var y = d3.scale.ordinal();

var barXAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .tickSize(-height)
    .tickPadding(10)
    .tickFormat(function(d) { return d * 10000});

var colors = d3.scale.quantize()
    .range(colorbrewer.Blues[7]);    

// create the chart
var chart = d3.select('#bar-chart').append('svg')
    .style('width', (width + margin.left + margin.right) + 'px')
  .append('g')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')');



d3.csv(url).row(function(d) {
    d.Total = +d.Total;
    d["Contracts"] = +d["Contracts"];
    d.percent = d["Contracts"] / d.Total;

    return d;
}).get(function(err, data) {
    // sort
    data = _.sortBy(data, 'percent').reverse();

    // set y domain
    y.domain(d3.range(data.length))
        .rangeBands([0, data.length * barHeight]);

    // set height based on data
    height = y.rangeExtent()[1];
    chartRatio = .4;
    d3.select(chart.node().parentNode)
        .style('height', function() {
            if (window.innerWidth > breakPoint) { return (height + margin.top + margin.bottom) + 'px' }
                else { return(((height + margin.top + margin.bottom) * chartRatio )+ 'px' )}
        })
        .attr("fill", function(d) {
            return "rgb(0, 0, " + (d * 10) + ")";
        });

    // reset y domain to fit new chart size
    barHeight = parseInt(d3.select("#bar-chart").style("height")) / 10;
    y.domain(d3.range(data.length))
        .rangeBands([0, data.length * barHeight]);
            
    // add top and bottom axes
    chart.append('g')
        .attr('class', 'bar-chart x axis top')
        .call(barXAxis.orient('top'));

    var bars = chart.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d, i) { return 'translate(0,'  + y(i) + ')'; });

    bars.append('rect')
        .attr('class', 'background')
        .attr('height', y.rangeBand())
        .attr('width', width);

    bars.append('rect')
        .attr('class', function(d) { return 'percent ' + d.Name; })
        .attr('height', y.rangeBand())
        .attr('width', function(d) { return x(d.percent); })

    bars.append('text')
        .text(function(d) { return d.Name; })
        .attr('class', function(d) { return 'name ' + d.Name; })
        .attr('y', y.rangeBand() - 10)
        .attr('x', spacing);

    // add median ticks
    var median = d3.median(data, function(d) { return d.percent; });

    d3.select('span.median').text(percent(median));

    bars.append('line')
        .attr('class', 'median')
        .attr('x1', x(median))
        .attr('x2', x(median))
        .attr('y1', 1)
        .attr('y2', y.rangeBand() - 1);
});

// resize
d3.select(window).on('resize', resize); 

function resize() {

    var chartRatio = .4;
    // update width
    width = parseInt(d3.select('#bar-chart').style('width'), 10);
    width = width - margin.left - margin.right;

    // resize the chart
    x.range([0, width]);
    d3.select(chart.node().parentNode)
        .style('height', function() {
            if (window.innerWidth > breakPoint) { return width + 'px' }
                else { return (width * chartRatio) + 'px' }
        })
        .style('width', (width + margin.left + margin.right) + 'px');

    barHeight = parseInt(d3.select(chart.node().parentNode).style('height')) / 10;

    var bars = chart.selectAll('.bar')
        .attr('transform', function(d, i) { return 'translate(0,'  + barHeight * i + ')'; });

    var barHeight = parseInt(d3.select("#bar-chart").style("height")) / 10; 

    bars.append('text')
        .attr('y', y.rangeBand() - 10);

    chart.selectAll('rect.background')
        .attr('height', barHeight)
        .attr('width', width);

    chart.selectAll('rect.percent')
        .attr('height', barHeight)
        .attr('width', function(d) { return x(d.percent); });

    // update median ticks
    var median = d3.median(chart.selectAll('.bar').data(), 
        function(d) { return d.percent; });
    
    chart.selectAll('line.median')
        .attr('x1', x(median))
        .attr('x2', x(median));


    // update axes
    chart.select('.bar-chart.x.axis.top').call(barXAxis.orient('top'));

}

// highlight code blocks
hljs.initHighlighting();
