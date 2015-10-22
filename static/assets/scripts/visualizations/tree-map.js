
// PLACEHOLDER DATA
var data = {
  "name": "cluster",
  "children": [
    { 
      "name": "Dept. of Defense", "mcap": 560
      // "children": [
      //   { "name": "Army", "mcap": 400 },
      //   { "name": "Navy", "mcap": 300 },
      //   { "name": "Air Force", "mcap": 100 },
      // ] 
    },
    { "name": "Dept. of Education", "mcap": 360 },
    { "name": "Dept. of Energy", "mcap": 325 },
    { "name": "Dept. of Transportation", "mcap": 183 },
  ]
};

var color = d3.scale.category20c();

var treemap =
  d3.layout.treemap()
  // use 100 x 100 px, which we'll apply as % later
  .size([100, 100])
  .sticky(true)
  .value(function(d) { return d.mcap; });

var div = d3.select(".treemap");

function position() {
  this
    .style("left", function(d) { return d.x + "%"; })
    .style("top", function(d) { return d.y + "%"; })
    .style("width", function(d) { return d.dx + "%"; })
    .style("height", function(d) { return d.dy + "%"; });
}

function getLabel(d) {
  return d.name;
}

var node =
  div.datum(data).selectAll(".node")
  .data(treemap.nodes)
  .enter().append("div")
  .attr("class", "node")
  .call(position)
  .style("background", function(d) { return color(getLabel(d)); })
  .text(getLabel);
