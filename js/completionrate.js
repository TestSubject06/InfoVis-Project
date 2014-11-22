

//Gets called when the page is loaded.
function drawcompletionrate(Width, Height){
	var highSchoolsGraduated;
	var highSchoolsNotGraduated;
	var stack;
	var w = Width;
  	var h = Height;
  	var p = [20, 50, 30, 20];
  	var x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]);
  	var y = d3.scale.linear().range([0, h - p[0] - p[2]]);
  	var z = d3.scale.ordinal().range(["darkgray", "lightblue"]);

  	var svg = d3.select('#completion').append('svg:svg')
  		.attr("width", w)
  		.attr("height", h)
  	  .append("svg:g")
  	  	.attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

  
  d3.csv('data/QueryHighSchoolData.csv', function(error, data){
	// sort and get the sum of sales by region and store each object in salesbyregion
	highSchoolsGraduated = d3.nest()
				.key(function(d)	{ return d["High School"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.sum(d, function(g)	{return g["Degree Status"] == "Graduated" ? 1 : 0;});
				}).entries(data);
	//console.log(highSchoolsGraduated);

	highSchoolsNotGraduated = d3.nest()
				.key(function(d)	{ return d["High School"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.sum(d, function(g)	{return g["Degree Status"] == "Not Graduated" ? 1 : 0;});
				}).entries(data);
	//console.log(highSchoolsNotGraduated);

	var highSchools = new Array();
	// highSchools[0] = highSchoolsGraduated;
	// highSchools[1] = highSchoolsNotGraduated;

	// initialize an array that have all 3 necessary fields
	var schools = {highSchoolsName: "", graduated: "", notGraduated:"" };
	// populate the schools array
	for(i = 0; i < highSchoolsGraduated.length; i++){
		schools = {highSchoolsName:highSchoolsGraduated[i].key, graduated: highSchoolsGraduated[i].values, notGraduated: highSchoolsNotGraduated[i].values};
		//console.log(highSchoolsGraduated[i].key);
		highSchools.push(schools);
	}
	console.log(highSchools);

	// Transpose the data into layers by status
	highSchools = d3.layout.stack()(["graduated", "notGraduated"].map(function(status){
		return highSchools.map(function(d){
			return{x: d.highSchoolsName, y: +d[status]};
		});
	}));
	console.log(highSchools);
 
 	// Compute the x-domain by name of highschools and y-domain by top
 	x.domain(highSchools[0].map(function(d) {return d.x;}));
 	y.domain([0, d3.max(highSchools[highSchools.length - 1], function(d) {return d.y0 + d.y;})]);

 	// Add a group for each status
 	var status = svg.selectAll("g.status")
 		.data(highSchools)
 	  .enter().append("svg:g")
 	  	.attr("class", "status")
 	  	.style("fill", function(d, i) {return z(i);})
 	  	.style("stroke", function(d, i) {return d3.rgb(z(i)).darker();});
 	// Add a rect for each high school
 	var rect = status.selectAll("rect")
 		.data(Object)
 	  .enter().append("svg:rect")
 	  	.attr("x", function(d) {return x(d.x);})
 	  	.attr("y", function(d) {return -y(d.y0) - y(d.y);})
 	  	.attr("height", function(d) {return y(d.y);})
 	  	.attr("width", x.rangeBand())
 	 	.on("mouseover", function(d) {
 	 		//d3.select(this.parentNode)
 	 			svg.append("text")
 	 			.attr("x", d3.mouse(this)[0])
 	 			.attr("y", d3.mouse(this)[1]-15)
 	 			.style("text-anchor", "middle")
 	 			.style("font", "10px sans-serif")
 	 			.style("fill", "black")
 	 			.text(function() {return d.x + " " + (d.y) ;});
 	 	})
 	 	.on("mouseout", function(d){
 	 		svg.selectAll("text").remove();
 	 	});
 	
 	// var hover = d3.selectAll("rect")
 	// 	.append("div")
 	// 	.style("position", "absolute")
 	// 	.style("z-index", "10")
 	// 	.style("visibility", "visible")
 	// 	.text("test");

 	// Add a label per high school
 	// var label = svg.selectAll("text")
 	// 	.data(x.domain())
 	//   .enter().append("text")
 	//   	//.attr("x", function(d) {return x(d) + x.rangeBand() / 2;})
 	//   	//.attr("y", 6)
 	//   	.style("text-anchor", "middle")
 	//   	//.attr("dy", ".71em")
 	//   	.style("fill", "blue")
 	//   	.style("transform", "( " + function(d) {return x(d) + x.rangeBand() / 2;} + ",6)")
 	//   	.text(function(d) {return d.data;});
 	// Add y-axis rules.
 	var rule = svg.selectAll("g.rule")
 		.data(y.ticks(5))
 	  .enter().append("svg:g")
 	  	.attr("class", "rule")
 	  	.attr("transform", function(d) {return "translate(0," + -y(d) + ")";});

 	rule.append("svg:line")
 		.attr("x2", w - p[1] - p[3])
 		.style("stroke", function(d) {return d ? "#fff" : "#000";})
 		.style("stroke-opacity", function(d) {return d ? .7 : null;});

 	rule.append("svg:text")
 		.attr("x", w - p[1] - p[3] + 6)
 		.attr("dy", ".35em")
 		.text(d3.format(",d"));

 	
	
  });
}

