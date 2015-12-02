// PLACEHOLDER DATA
var data = [{
        'fiscal_year': 2000,
        'obligatedAmount': 3000000,
    },{
        'fiscal_year': 2001,
        'obligatedAmount': 3049581,
    },{
        'fiscal_year': 2002,
        'obligatedAmount': 1239087,
    },{
        'fiscal_year': 2003,
        'obligatedAmount': 4837502,
    },{
        'fiscal_year': 2004,
        'obligatedAmount': 4540987,
    },{
        'fiscal_year': 2005,
        'obligatedAmount': 8937042,
    },{
        'fiscal_year': 2006,
        'obligatedAmount': 7402384,
    },{
        'fiscal_year': 2007,
        'obligatedAmount': 9342384,
    },{
        'fiscal_year': 2008,
        'obligatedAmount': 2932384,
    },{
        'fiscal_year': 2009,
        'obligatedAmount': 3782384,
    },{
        'fiscal_year': 2010,
        'obligatedAmount': 3522384,
    },{
        'fiscal_year': 2011,
        'obligatedAmount': 9372384,
    },{
        'fiscal_year': 2012,
        'obligatedAmount': 9282384,
    },{
        'fiscal_year': 2013,
        'obligatedAmount': 5872384,
    },{
        'fiscal_year': 2014,
        'obligatedAmount': 3652384,
    },{
        'fiscal_year': 2015,
        'obligatedAmount': 9382384,
    }];


var margin = 40,
    width = parseInt(d3.select("#graph").style("width")) - margin*2,
    height = parseInt(d3.select("#graph").style("height")) - margin*2;

var xScale = d3.scale.linear()
    .range([0, width])
    .nice();

var yScale = d3.scale.linear()
    .range([height, 0])
    .nice();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(d3.format("d"))
    .tickSize(-height);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { 
      console.log('Plotting at x-point: ' +  xScale(d.fiscal_year))
      return xScale(d.fiscal_year); 
    })
    .y(function(d) { return yScale(d.obligatedAmount); });

var graph = d3.select("#graph").append("svg")
    .attr("width", width + margin*2)
    .attr("height", height + margin*2)
    .attr("id", "lineChart")
  .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");


// Un-comment when ready to use real data
// d3.json('/static/data/sampleHPdata.json', function(error, data) {
//   if (error) throw error;

//   data = data['usaspendingSearchResults']['result']['doc']

//   data.forEach(function(d) {
//     d.fiscal_year = d['fiscal_year'];
//     d.obligatedAmount = d['obligatedAmount']
//   });
    
  xScale.domain(d3.extent(data, function(d) { return d.fiscal_year; }));
  yScale.domain(d3.extent(data, function(d) { return d.obligatedAmount; }));

  graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  graph.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    // .append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 15)
    //   .attr("dy", "1.5em")
    //   .style("text-anchor", "end")
    //   .text("Obligated amount")
    ;

  graph.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

      var obj = d3.select('#graph').style('width');


  // THIS RESIZES THE CHART WHENEVER THE PAGE IS RESIZED
  function resizeLine() {
    var margin = 40
      , width = parseInt(d3.select("#graph").style("width")) - margin * 2
      , height = parseInt(d3.select("#graph").style("height")) - margin * 2;

      var obj = parseInt(d3.select('#graph').style('width'));

    /* Update the range of the scale with new width/height */
    xScale.range([0, width]);
    yScale.range([height, 0]).nice();

    xAxis.tickSize(-height);

    /* Update the axis with the new scale */
    graph.select('.x.axis')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    graph.select('.y.axis')
      .call(yAxis);

    /* Force D3 to recalculate and update the line */
    graph.selectAll('.line')
      .attr("d", line);
  };

  d3.select(window).on('resize.line', resizeLine);

  resizeLine();      
// });


