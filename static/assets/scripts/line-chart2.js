function init(data) {
    setOptions(data);
}

function setOptions(data) {
    var options = {};
    options.data = data;
    options.dimensions = {};

    var dimensions = options.dimensions;
    dimensions.margins = [60,60,60,60];
    dimensions.width = 1000 - dimensions.margins[1] - dimensions.margins[3];
    dimensions.height = 400 - dimensions.margins[0] - dimensions.margins[2];

    creatSvg(options);
}

function createSvg(options) {
    var dimensions = options.dimensions,
        margins = dimensions.margins;
        width = dimensions.width;
        height = dimensions.height;

    var scales = createScales(options);
    var axes = createAxes(options, scales);
    var graph = d3.select("#company_chart").append("svg:svg")
          .attr("width", width + margins[1] + margins[3])
          .attr("height", height + margins[0] + margins[2])
        .append("svg:g")
          .attr("transform", "translate(" + margins[3] + "," + margins[0] + ")");

    options.graph = graph;
    options.scales = scales;
    options.axes = axes;
    drawLineChart(options);
}

function createScales(options) {
    var data = options.data,
        width = options.dimensions.width,
        height = options.dimensions.height;

    var x = d3.scale.linear()
        .domain([0, data.length])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, 10])
        .range([height, 0]);

    var scales = {
        'x': x,
        'y': y
    }

    return scales;
}

function createAxes(options, scales) {
    var data = options.data,
        width = options.dimensions.width,
        height = options.dimensions.height,
        x = scales.x,
        y = scales.y

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(-height)
        .tickSubdivide(true);
    
    var yAxisLeft = d3.svg.axis()
        .scale(y)
        .ticks(4)
        .orient("left");

    axes = { 
        'xAxis': xAxis,
        'yAxisLeft': yAxisLeft
    };

    return axes
}

function drawLineChart(options) {
    var x = options.scales.x,
        y = options.scales.y,
        graph = options.graph,
        height = opptions.dimensions.height,
        xAxis = options.axes.xAxis,
        yAxisLeft = options.axes.yAxisLeft,
        data = options.data;

    var line = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function(d,i) { 
            // verbose logging to show what's actually being done
            console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
            // return the X coordinate where we want to plot this datapoint
            return x(i); 
        })
        .y(function(d) { 
            // verbose logging to show what's actually being done
            console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
            // return the Y coordinate where we want to plot this datapoint
            return y(d); 
        })

    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(-25,0)")
          .call(yAxisLeft);

    graph.append("svg:path").attr("d", line(data));
}

init(data);
