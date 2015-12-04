var margin = {top: 2, left: 2, bottom: 2, right: 2}
  , width = parseInt(d3.select('#congress-districts-map').style('width'))
  , width = width - margin.left - margin.right
  , mapRatio = .5
  , height = width * mapRatio;

var projection = d3.geo.albersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#congress-districts-map").append("svg")
    .attr("width", width + 'px')
    .attr("height", height + 'px');

// QUEUE DATA
queue()
    .defer(d3.json, urls.us)
    .defer(d3.csv, urls.data)
    .await(render);

// PLACEHOLDER DATA
queue()
    .defer(d3.json, "/static/assets/scripts/visualizations/maps/us-cd.json")
    .defer(d3.json, "/static/assets/scripts/visualizations/maps/cd-113.json")
    .await(ready);

function ready(error, us, congress) {
  if (error) throw error;

  svg.append("defs").append("path")
      .attr("id", "land")
      .datum(topojson.feature(us, us.objects.land))
      .attr("d", path);

  // svg.append("clipPath")
  //     .attr("id", "clip-land")
  //   .append("use")
  //     .attr("xlink:href", "#land");

  svg.append("g")
      .attr("class", "districts")
      // .attr("clip-path", "url(#clip-land)")
    .selectAll("path")
      .data(topojson.feature(congress, congress.objects.districts).features)
    .enter().append("path")
      .attr('class', 'district')
      .attr("d", path)
    .append("title")
      .text(function(d) { console.log(d.id); return d.id; });

  svg.append("path")
      .attr("class", "district-boundaries")
      .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
      .attr("d", path);

  svg.append("path")
      .attr("class", "state-boundaries")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("d", path);
}

d3.select(self.frameElement).style("height", height + "px");

d3.select(window).on('resize.cd_map', resizeCDMap);

function resizeCDMap() {
    // adjust things when the window size changes
    width = parseInt(d3.select('#congress-districts-map').style('width')) - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection
        .translate([width / 2, height / 2])
        .scale(width);

    // resize the map container
    svg
        .style('width', width + 'px')
        .style('height', height + 'px');

    // resize the map
    svg.select('.districts').attr('d', path);
    svg.selectAll('.state-boundaries').attr('d', path);
    svg.selectAll('.district-boundaries').attr('d', path);
    svg.selectAll('.district').attr('d', path);
};