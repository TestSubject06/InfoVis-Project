

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
  	
  	// initialize, create and populate the globalTemp array.
  	var globalInfo = new Array();
  	var temp = {school: "", applied: "", accepted: "", percentageAccepted:"" };
  	var temp_applied, temp_accepted, temp_percentage_accepted;
  	d3.csv('data/CS4460_HighSchoolAcceptanceRates_v2.csv', function(error, data){
  		temp_applied = d3.nest()
				.key(function(d)	{ return d["High School Description"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.sum(d, function(g)	{return g.Applied;});
				}).entries(data);
				console.log(temp_applied);
				console.log(temp_applied.length);
		temp_accepted = d3.nest()
				.key(function(d)	{ return d["High School Description"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.sum(d, function(g)	{return g.Accepted;});
				}).entries(data);
				console.log(temp_accepted);
				console.log(temp_accepted.length);
		temp_percentage_accepted = d3.nest()
				.key(function(d)	{ return d["High School Description"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.sum(d, function(g)	{return g["Percentage Accepted"];});
				}).entries(data);
				console.log(temp_percentage_accepted);
				console.log(temp_percentage_accepted.length);
		// populate the globalInfo array
		for(i = 0; i < temp_applied.length; i++){
			temp = {school:temp_applied[i].key, applied: temp_applied[i].values, accepted: temp_accepted[i].values, percentageAccepted: temp_percentage_accepted[i].values};
			globalInfo.push(temp);
		}
		console.log(globalInfo);
	});
  	
 
  d3.csv('data/QueryHighSchoolData.csv', function(error, data){
	// sort and get the number of graduated for each school using rollup function
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
 	 	
 	 	svg.append("text")
         .text("Number of graduated and not graduated students in Georgia Institute of Technology by high schools")
         .attr("x", 100)
         .attr("y", 13);

   		svg.append("text")
         .text("Hover over bar to see exact value, color: Grey = Graduated, Blue = Not Graduated")
         .attr("x", 100)
         .attr("y", 27);
 	 	});
 	 	// .on("click", function(d){
 	 	// 	sortChart();
 	 	// });	

 	
 	// var sortDir = 'asc';
 	// var sortChart = function(){
 	// 	// declare array to hold re-ordered ordinal domain for xScale
 	// 	var newDomain = new Array();
 	// 	svg.selectAll('rect')
 	// 		.sort(function(a,b){
 	// 			if(sortDir == 'asc'){
 	// 				//console.log(a.y);
 	// 				//console.log(b.y);
 	// 				return d3.ascending(a.y, b.y);
 	// 			}
 	// 			else{
 	// 				return d3.descending(a.y, b.y);
 	// 			}
 	// 		})
		// 	.transition()
		// 	// add a delay() call before duration() call
		// 	.delay(function(d,i){
		// 		return i * 50;
		// 	})
		// 	.duration(1000)
		// 	.attr("x", function(d, i) {return x(i);})
 	//   		//.attr("y", function(d) {return -y(d.y0) - y(d.y);});
	 // 	  	//.attr("height", function(d) {return y(d.y);})
 	//   		//.attr("width", x.rangeBand())
 	//   		svg.selectAll('rect') 	  			
 	//   			.each(function(d){
 	//   				newDomain.push(highSchools);
 	//   		});
 	//   			console.log(newDomain);
 	//   		x.domain(newDomain[0].map(function(d) {return d.x;}));
		// 	sortDir = sortDir = 'asc' ? 'desc' : 'asc';
 	// }

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

