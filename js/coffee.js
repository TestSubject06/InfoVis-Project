var chart;
var height = 300;
var width = 400;
//DEFINE YOUR VARIABLES UP HERE
var y;
var x;
var xAxisLabel;
var yAxisLabel;
var margin;
var xAxis;
var yAxis;

//Gets called when the page is loaded.
function init(){
	chart = d3.select('#vis').append('svg');
	//PUT YOUR INIT CODE BELOW
	margin = {top: 15, right: 55, bottom: 30, left: 15};
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
	
	y = d3.scale.linear()
		.range([height, 0]);
	
	x = d3.scale.ordinal()
		.rangeRoundBands([0,width], .1);
	
	chart = chart.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

//Called when the update button is clicked
function updateClicked(){
  chart.selectAll("*").remove();
  xAxisLabel = getXSelectedOption();
  yAxisLabel = getYSelectedOption();
  d3.csv('data/CoffeeData.csv',update, function(error, csvData){
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

//Callback for when data is loaded
function update(d){
  //PUT YOUR UPDATE CODE BELOW
  return{date: d.date, sales: +d.sales, profit: +d.profit, region: d.region, category: d.category, type: d.type, ceffeination: d.caffeination};
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
