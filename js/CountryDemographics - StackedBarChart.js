//Gets called when the page is loaded.
function drawCountryChart(Width, Height){
	var chart;
	var height = Height;
	var width = Width;
	var y;
	var x;
	var xAxisLabel;
	var yAxisLabel;
	var margin = {top: 15, right: 15, bottom: 30, left: 55};
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
				
	var area = d3.svg.area()
				.x(function(d) {return x(d.year);})
				.y0(function(d) {return y(d.y0);})
				.y1(function(d) {return y(d.y0 + d.y);});
				
	var stack = d3.layout.stack()
				.values(function(d) { return d.values; })
				.order(function(data){return d3.range(data.length);});


	chart = d3.select('#country').append('svg');
	//PUT YOUR INIT CODE BELOW
	
	y = d3.scale.linear()
		.range([chartHeight, 0]);
	
	x = d3.time.scale()
		.range([0, width]);
	
	chart = chart.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	d3.tsv('data/CS4460_Demographics_Country.tsv',function(error, data){
		color.domain(d3.keys(data[0]).filter(function(key) {return key !== "year"}));
		
		data.forEach( function(d) {
			d.year = parseDate(d.year);
		});
		
		var countries = stack(color.domain().map(function(country) {
			return{
				country: country,
				values: data.map(function(d) {
					return {year: d.year, y: (country!="United States of America" && country!="China" && country != "India" && country != "Korea, Republic of (South)")?+d[country]:0};
				})
			};
		}));
		
		y.domain([0, d3.max(data, function(d){
			var sum = 0;
			for (var property in d) {
				if(property != "year" && property != "United States of America" && property!="China" && property != "India" && property != "Korea, Republic of (South)")
					sum += +d[property];
			}
			return sum;
		})]);
		x.domain(d3.extent(data, function(d) {return d.year;} ));
		
		var bar = chart.selectAll("countries")
			.data(countries)
		  .enter().append("g")
			.attr("class", "countries");
			
		bar.append("path")
			.attr("class", "area")
			.attr("d", function(d) { return area(d.values); })
			.style("fill", function(d) {return color(d.country);})
			.append("title")
			.text(function(d){return d.country;});
		
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
			.call(xAxis)
            .style("font-size", "12px");
			
		chart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
            .style("font-size", "12px");
	});
	
}