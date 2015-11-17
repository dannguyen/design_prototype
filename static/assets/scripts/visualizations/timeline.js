var dataset = [ [2004,  2006], 2004, 2006]
  , arrayLength = dataset.length // Placeholder data
  , allValues = [];

for (var i = 0; i < arrayLength; i++) {
    if(isNaN(dataset[i]) == false) { allValues.push(dataset[i]) }
        else { allValues.push(dataset[i][0]); allValues.push(dataset[i][1])}
};

var min = d3.min(allValues)
  , max = d3.max(allValues);

var margins = 20
  , width = parseInt(d3.select('#timeline').style('width')) - margins*2
  , height = parseInt(d3.select('#timeline').style('height')) - margins*2;

var xScale = d3.scale.linear()
                .domain([2000, 2015])
                .range([0, width - margins]);

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
    .attr('y', margins * 2)
    .attr('height', 30)
    .attr('width', function(d) {
        if(isNaN(d) == false) { return 2; }
            else { return xScale(d[1]) - xScale(d[0]) }
    });

svg.append('g')
    .attr('class', 'axis')
    .attr("transform", "translate(0," + (height - margins) + ")")
    .call(xAxis);