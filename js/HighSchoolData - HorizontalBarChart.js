//Gets called when the page is loaded.
function drawSchoolGPAChart(Width, Height){
	var chart;
	var height = Height;
	var width = Width;
	var y;
	var x;
	var xAxisLabel;
	var yAxisLabel;
	var margin = {top: 15, right: 15, bottom: 30, left: 110};
	var chartWidth = width - margin.left - margin.right;
	var chartHeight = height - margin.top - margin.bottom;
	var color = d3.scale.category10();
	var parseDate = d3.time.format("%Y").parse;

	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				
	var stack = d3.layout.stack()
				.values(function(d) { return d.values; })
				.order(function(data){console.log(data); return d3.range(data.length);});


	chart = d3.select('#HighSchoolGPA').append('svg');
	//PUT YOUR INIT CODE BELOW
	
	y = d3.scale.linear()
		.range([chartHeight, 0]);
	
	x = d3.scale.linear()
		.range([0, chartWidth]);
	
	chart = chart.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	d3.tsv('data/CS4460_QueryHighSchoolData.tsv',function(error, data){
		var averageGPAs = d3.nest()
			.key(function (d){
				return d["High School"];
			})
			.sortKeys(d3.ascending)
			.rollup(function (d){
				return d3.mean(d, function(g){
					return +g.HSGPA;
				});
			})
			.entries(data);
			
		averageGPAs.sort(function (a,b){return b.values-a.values});
			
		x.domain(d3.extent(averageGPAs, function(d){return d.values;}));
		
		
		console.log(averageGPAs);
	
		var bar = chart.selectAll("highSchools")
			.data(averageGPAs)
		  .enter().append("g")
			.attr("class", "highSchools")
			.attr("transform", function(d, i){return "translate( 0,"+i*3+")";});
			
		bar.append("rect")
			.attr("width", function(d){return x(d.values);})
			.attr("height", "2");
		
		xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(10);
			
		yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(10);
			
		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + chartHeight + ")")
			.call(xAxis);
			
		chart.append("g")
			.attr("class", "y axis")
			.call(yAxis);
	});
}