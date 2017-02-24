var dispatch = d3.dispatch("load", "yearchange");

var groups = [
  "1960","1970","1980","1990","2000"
];

d3.csv("data/year.csv", function(error, years) {
  if (error) throw error;
  var yearById = d3.map();
  years.forEach(function(d) { yearById.set(d.Year, d); });
  dispatch["load"].call("load", this, yearById);
  dispatch["yearchange"].call("yearchange", this, this);
});

// A drop-down menu for selecting a state; uses the "menu" namespace.
dispatch.on("load.menu", function(yearById) {
  //////////////////////////////
  var select = d3.select("body").select("aside")
    .append("div")
    .append("select")
      .on("change", function() { dispatch["yearchange"].call("yearhange", this,this);});
//console.log(yearById.values());
  select.selectAll("option")
      .data(groups)
    .enter().append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) { return d; });

  dispatch.on("yearchange.menu", function(state) {
    select.property("value", state.value);
    //console.log(state)
  });
});

dispatch.on("load.chord", function(yearById) {
var width = 720,
height = 720,
outerRadius = Math.min(width, height) / 2 - 10,
innerRadius = outerRadius - 24;

var formatPercent = d3.format(".1%");
var arc = d3.svg.arc()
.innerRadius(innerRadius)
.outerRadius(outerRadius);

var layout = d3.layout.chord()
.padding(.04)
.sortSubgroups(d3.descending)
.sortChords(d3.ascending);

var path = d3.svg.chord()
.radius(innerRadius);
show("1960")
dispatch.on("yearchange.chord", function(d) {
var yr = d.value
show(yr)
});
});

function show(data) {
var width = 720,
height = 720,
outerRadius = Math.min(width, height) / 2 - 10,
innerRadius = outerRadius - 24;

var formatPercent = d3.format(".1%");
var arc = d3.svg.arc()
.innerRadius(innerRadius)
.outerRadius(outerRadius);

var layout = d3.layout.chord()
.padding(.04)
.sortSubgroups(d3.descending)
.sortChords(d3.ascending);

var path = d3.svg.chord()
.radius(innerRadius);

var yr = data

d3.csv("data/country_"+yr.substring(2,4)+".csv", function(cities) {
d3.json("data/matrix_"+yr.substring(2,4)+".json", function(matrix) {

d3.select('body').select('#chordChart').select('svg').remove();

var svg = d3.select("body").select('#chordChart').append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("id", "circle")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("circle")
.attr("r", outerRadius);

/////add tip////
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d,i) {
      return "<strong>Name:</strong> <span style='color:red'>" + cities[i].name + "</span>"+
              "<br>"+"<strong>Inflow:</strong> <span style='color:red'>" + cities[i].Inflow + "</span>"+
              "<br>"+"<strong>Ourflow:</strong> <span style='color:red'>" + cities[i].Outflow + "</span>"+
              "<br>"+"<strong>Netflow:</strong> <span style='color:red'>" + cities[i].Netflow + "</span>";
    })
svg.call(tip);

// Compute the chord layout.
layout.matrix(matrix);
// Add a group per neighborhood.
var group = svg.selectAll(".group")
.data(layout.groups)
.enter().append("g")
.attr("class", "group")
.on("mouseover", mouseover);
// Add the group arc.
var groupPath = group.append("path")
.attr("id", function(d, i) { return "group" + i; })
.attr("d", arc)
.style("fill", function(d, i) { return cities[i].color; })
.on('mouseover', tip.show)
.on('mouseout', tip.hide);


// Add a text label.
var groupText = group.append("text")
.attr("x", 6)
.attr("dy", 15);

groupText.append("textPath")
.attr("xlink:href", function(d, i) { return "#group" + i; })
.text(function(d, i) { return cities[i].name; });
// Remove the labels that don't fit. :(
groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
.remove();

// Add the chords.
var chord = svg.selectAll(".chord")
.data(layout.chords)
.enter().append("path")
.attr("class", "chord")
.style("fill", function(d) { return cities[d.source.index].color; })
.attr("d", path);

// Add an elaborate mouseover title for each chord.
 chord.append("title").text(function(d) {
 return cities[d.source.index].name
 + " → " + cities[d.target.index].name
 + ": " + formatPercent(d.source.value)
 + "\n" + cities[d.target.index].name
 + " → " + cities[d.source.index].name
 + ": " + formatPercent(d.target.value);
 });

function mouseover(d, i) {
chord.classed("fade", function(p) {
return p.source.index != i
&& p.target.index != i;
});
}
});
});
};
