
var urls = {
    us: "/static/assets/scripts/visualizations/maps/us.json",
    data: "/static/assets/scripts/visualizations/maps/bachelors-degrees.csv" // PLACEHOLDER!
};

var margin = {top: 2, left: 2, bottom: 2, right: 2}
  , width = parseInt(d3.select('#map').style('width'))
  , width = width - margin.left - margin.right
  , mapRatio = .5
  , height = width * mapRatio;

var formats = {
    percent: d3.format('%')
};

var projection = d3.geo.albersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var colors = d3.scale.quantile()
    // .domain()
    .range(colorbrewer.Blues[7]);

var map = d3.select('#map').append('svg')
    .style('height', height + 'px')
    .style('width', width + 'px');

// QUEUE DATA
queue()
    .defer(d3.json, urls.us)
    .defer(d3.csv, urls.data)
    .await(render);

// MAKES MAP RESPONSIVE
d3.select(window).on('resize.map', resize); 

// TOOLTIP TEMPLATE. CODE FOR TEMPLATE ON THE HTML TEMPLATE PAGE
var template = _.template(d3.select('#map-tooltip-template').html());

function render(err, us, data) {

    var land = topojson.mesh(us, us.objects.land),
        states = topojson.feature(us, us.objects.states);

    window.us = us;

    data = window.data = _(data).chain().map(function(d) {
        d.Total = +d.Total;
        d["Contracts"] = +d["Contracts"];
        d.percent = d["Contracts"] / d.Total;
        return [d.Name, d];
    }).object().value();

    colors.domain([
        0, 
        d3.max(d3.values(data), function(d) { return d.percent; })
    ]);

    map.append('path')
        .datum(land)
        .attr('class', 'land')
        .attr('d', path);

    var states = map.selectAll('path.state')
        .data(states.features)
      .enter().append('path')
        .attr('class', function(d) { 
            return "state " + d.properties.name.replace(/\s/g, '-'); // changed from d.properties.name.toLowerCase.replace(/\s/g, '-');
        })
        .attr('d', path)
        .style('fill', function(d) {
            var name = d.properties.name
              , value = data[name] ? data[name].percent : null;

            return colors(value);
        });
    

    states.on('mouseover', syncedMouseIn)
        .on('mouseout', syncedMouseOut);
    
    // var stateClasses = states.attr('class').split(' ')[1];
    states.each(function(d){
        var name =  d.properties.name.replace(/\s/g, '-');
        // console.log(name);
    });
}

// UPDATES SIZE OF MAP WHEN WINDOW RESIZES
function resize() {
    // adjust things when the window size changes
    width = parseInt(d3.select('#map').style('width')) - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection
        .translate([width / 2, height / 2])
        .scale(width);

    // resize the map container
    map
        .style('width', width + 'px')
        .style('height', height + 'px');

    // resize the map
    map.select('.land').attr('d', path);
    map.selectAll('.state').attr('d', path);
};

// ADDS TOOLTIP TO MAP
function tooltipShow(d, i) {
    var datum = data[d.properties.name];
    if (!datum) return;

    datum.formats = formats;

    $(this).tooltip({
        title: template(datum),
        html: true,
        container: map.node().parentNode,
        placement: 'auto'
    }).tooltip('show');
}

function tooltipHide(d, i) {
    $(this).tooltip('hide');
}

function syncedMouseIn(d) {
    tooltipShow; // NOT WORKING
    var name =  d.properties.name.replace(/\s/g, '-');
        d3.selectAll('.percent.' + name).style('fill', '#D00441');
}
function syncedMouseOut(d) {
    tooltipHide; // NOT WORKING
    var name =  d.properties.name.replace(/\s/g, '-');
        d3.selectAll('.percent.' + name ).style('fill', '#57C3EC')
            
}

// highlight my code blocks
d3.selectAll('pre code').each(function() {
    var code = d3.select(this)
      , highlight = hljs.highlight('javascript', code.html());

    code.html(highlight.value);
});