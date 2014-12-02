//Gets called when the page is loaded.
var selectedHighSchools = [""];
var highlightedHighSchool = "";
var HighSchoolAverageGPARollupData = null;
function drawSchoolGPAChart(Width, Height, SmallChart){
	var chart;
	var height = Height;
	var width = Width;
	var y;
	var x;
	var xAxisLabel;
	var yAxisLabel;
	var margin = SmallChart ? {top:5, right:5, bottom:5, left:5} : {top: 10, right: 10, bottom: 30, left: 150};
	var chartWidth = width - margin.left - margin.right;
	var chartHeight = height - margin.top - margin.bottom;
	var color = d3.scale.category10();
	var parseDate = d3.time.format("%Y").parse;

	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
	chart = d3.select('#HighSchoolGPA').append('svg');
	//PUT YOUR INIT CODE BELOW
	
	y = d3.scale.ordinal()
		.rangeBands([chartHeight, 0]);
	
	x = d3.scale.linear()
		.range([0, chartWidth]);
	
	chart = chart.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	if(HighSchoolAverageGPARollupData == null){
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
			
		averageGPAs.sort(function (a,b){return a.values-b.values});
		
		HighSchoolAverageGPARollupData = averageGPAs;
			
		x.domain([d3.min(averageGPAs, function(d) {return d.values;})-0.05, d3.max(averageGPAs, function(d){return d.values;})]);
		y.domain(averageGPAs.map(function(d) {return d.key;}));
	
		var bar = chart.selectAll("highSchools")
			.data(averageGPAs)
		  .enter().append("g")
			.attr("class", "highSchools")
			.attr("transform", function(d, i){return "translate( 0,"+y(d.key)+")";});
			
		bar.append("rect")
			.attr("width", function(d){return x(d.values);})
			.attr("height", y.rangeBand())
			.attr("fill", function(d){return (selectedHighSchools.indexOf(d.key)>=0) ? "steelblue" : "black";})
			.on("mouseover", function(){
				d3.select(this)
					.attr("fill", "red")
					
				d3.select(this.parentNode)
					.append("text")
					.attr("transform", "translate(-5, 5)")
					.style("text-anchor", "end")
					.style("font", "10px sans-serif")
					.style("fill", "blue")
					.text(function(d){return d.key;});
			})
			.on("mouseout", function(){
				d3.select(this)
					.attr("fill", function(d){return (selectedHighSchools.indexOf(d.key)>=0) ? "steelblue" : "black";});
					
				bar.select("text").remove();
			})
			.on("mousedown", function(){
				d3.select(this)
					.attr("fill", function(d){selectedHighSchools[0] = d.key; return "steelblue"});
				bar.selectAll("rect").attr("fill", function(d){return (selectedHighSchools.indexOf(d.key)>=0) ? "steelblue" : "black";});

				chart.transition()
					.duration(750)
					.attr("transform", "scale(0.35)")
					.each("end", displaySmallGraph);
				
				d3.select('#HighSchoolGPA').select('svg')
					.transition()
					.duration(900)
					.attr("height", 220)
					.attr("width", 300)
					.remove();
					
				d3.select('#HighSchoolGPA')
					.transition()
					.duration(900)
					.style("left", "50px")
					.style("top", "50px");
			});
		
		if(!SmallChart)	{
			xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.ticks(10);
			chart.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + chartHeight + ")")
				.call(xAxis);
		}
			
	});
	}else{
		x.domain([d3.min(HighSchoolAverageGPARollupData, function(d) {return d.values;})-0.05, d3.max(HighSchoolAverageGPARollupData, function(d){return d.values;})]);
		y.domain(HighSchoolAverageGPARollupData.map(function(d) {return d.key;}));
	
		var bar = chart.selectAll("highSchools")
			.data(HighSchoolAverageGPARollupData)
		  .enter().append("g")
			.attr("class", "highSchools")
			.attr("transform", function(d, i){return "translate( 0,"+y(d.key)+")";});
			
		bar.append("rect")
			.attr("width", function(d){return x(d.values);})
			.attr("height", y.rangeBand())
			.attr("fill", function(d){return (selectedHighSchools.indexOf(d.key)>=0) ? "steelblue" : "black";})
			.on("mouseover", function(){
				d3.select(this)
					.attr("fill", "red")
					
				d3.select(this.parentNode)
					.append("text")
					.attr("transform", "translate(-5, 5)")
					.style("text-anchor", "end")
					.style("font", "10px sans-serif")
					.style("fill", "blue")
					.text(function(d){return d.key;});
			})
			.on("mouseout", function(){
				d3.select(this)
					.attr("fill", function(d){return (selectedHighSchools.indexOf(d.key)>=0) ? "steelblue" : "black";});
					
				bar.select("text").remove();
			})
			.on("mousedown", function(){
				d3.select(this)
					.attr("fill", function(d){selectedHighSchools[0] = d.key; return "steelblue"});
				bar.selectAll("rect").attr("fill", function(d){return (selectedHighSchools.indexOf(d.key)>=0) ? "steelblue" : "black";});

				
				//Testing the transitions for the whole fucking div
				chart.transition()
					.duration(750)
					.attr("transform", "scale(0.35)")
					.each("end", displaySmallGraph);
				
				d3.select('#HighSchoolGPA').select('svg')
					.transition()
					.duration(900)
					.attr("height", 220)
					.attr("width", 300)
					.remove();
					
				d3.select('#HighSchoolGPA')
					.transition()
					.duration(900)
					.style("left", "50px")
					.style("top", "50px");
			});
		
		if(!SmallChart)	{
			xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.ticks(10);
			
			chart.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + chartHeight + ")")
				.call(xAxis);
		}
	}
}

function displaySmallGraph(){
	drawSchoolGPAChart(300, 300, true);
}