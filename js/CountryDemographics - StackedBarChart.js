var COUNTRY_chart;
var COUNTRY_height = 300;
var COUNTRY_width = 400;
var COUNTRY_y;
var COUNTRY_x;
var COUNTRY_xAxisLabel;
var COUNTRY_yAxisLabel;
var COUNTRY_margin = {top: 15, right: 55, bottom: 30, left: 15};
var COUNTRY_chartWidth = width - margin.left - margin.right;
var COUNTRY_chartHeight = height - margin.top - margin.bottom;
var COUNTRY_color = d3.scale.category20();

var COUNTRY_xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
var COUNTRY_yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(formatPercent);
			
var COUNTRY_area = d3.svg.area()
			.x(function(d) {return x(d.country);})
			.y0(function(d) {return y(d.y0);})
			.y1(function(d) {return y(d.y0 + d.y);});
			
var COUNTRY_stack = d3.layout.stack()
			.values(function(d) { return d.values; });
			
//Gets called when the page is loaded.
function drawCountryChart(){
	chart = d3.select('#country').append('svg');
	//PUT YOUR INIT CODE BELOW
	
	y = d3.scale.linear()
		.range([height, 0]);
	
	x = d3.scale.ordinal()
		.rangeRoundBands([0,width], .1);
	
	chart = chart.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	d3.csv('data/CS4460_Demographics_Country.csv',update, function(error, csvData){
	var data = d3.nest()
	  .key(function(d) {return d[xAxisLabel];})
	  .rollup(function(d) {
		return d3.sum(d, function(g) {return g[yAxisLabel];});
	  }).entries(csvData);
	
	y.domain([0, d3.max(data, function(d) {return d.values;})]);
	x.domain(data.map(function(d) {return d.key;}));
	
	xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
		
	yAxis = d3.svg.axis()
		.scale(y)
		.orient("right")
		.ticks(10);
		
	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		
	chart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate( " + width + ",0)")
		.call(yAxis);
		
	var bar = chart.selectAll("bar")
		.data(data)
	  .enter().append("g")
	    .attr("transform", function(d, i){ return "translate(" + x(d.key) + ",0)";});
		
	bar.append("rect")
		.attr("y", function(d) { return y(d.values); })
        .attr("height", function(d) { return height - y(d.values); })
        .attr("width", x.rangeBand())
		.style("fill", "steelblue");
		
	bar.append("text")
      .attr("x", x.rangeBand() / 2)
      .attr("y", function(d) { return y(d.values) + 3; })
      .attr("dy", ".75em")
	  .style("fill", "white")
	  .style("font", "10px sans-serif")
	  .style("text-anchor", "middle")
      .text(function(d) { return d.values; });
  });
}

//Called when the update button is clicked
function updateClicked(){
  chart.selectAll("*").remove();
  xAxisLabel = getXSelectedOption();
  yAxisLabel = getYSelectedOption();
  
}

//Callback for when data is loaded
function update(d){
  //PUT YOUR UPDATE CODE BELOW
  return{country: d.country, _2005: +d._2005, _2006: +d._2006, _2007: +d._2007, _2008: +d._2008, _2009: +d._2009, _2010: +d._2010};
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}
