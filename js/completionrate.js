//Gets called when the page is loaded.
var HighSchoolGraduatedData = null;
function drawcompletionrate(Width, Height, SmallChart){
	var highSchoolsGraduated;
	var highSchoolsNotGraduated;
	var stack;
	var w = Width;
  	var h = Height;
  	var p = SmallChart ? [5, 5, 5, 5] : [20, 50, 30, 20];
  	var x = d3.scale.ordinal().rangeBands([0, w - p[1] - p[3]]);
  	var y = d3.scale.linear().range([0, h - p[0] - p[2]]);
  	var z = d3.scale.ordinal().range(["#fd8d3c", "#9ecae1"]);
	
	var drawTheChart = function(){
		// Compute the x-domain by name of highschools and y-domain by top
		x.domain(HighSchoolGraduatedData[0].map(function(d) {return d.x;}));
		y.domain([0, d3.max(HighSchoolGraduatedData[HighSchoolGraduatedData.length - 1], function(d) {return d.y0 + d.y;})]);

		// Add a group for each status
		var masterBars = svg.append("g");
		var status = masterBars.selectAll("g.status")
			.data(HighSchoolGraduatedData)
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
				if(!SmallChart){
					masterBars.append("text")
						.attr("x", d3.mouse(this)[0])
						.attr("y", d3.mouse(this)[1]-15)
						.style("text-anchor", "middle")
						.style("font", "10px sans-serif")
						.style("fill", "black")
						.text(function() {return d.x + " " + (d.y) ;});
				}
				highlightedHighSchool = d3.select(this)[0]['0'].__data__.x;
				masterBars.selectAll("rect")
					.attr("fill", function(d){return d.x==highlightedHighSchool?(d.y0==0?d3.rgb(z(0)).brighter().brighter():d3.rgb(z(1)).brighter()):(d.y0==0?z(0):z(1))})
					.attr("stroke", function(d){return d.x==highlightedHighSchool?(d.y0==0?d3.rgb(z(0)).brighter():d3.rgb(z(1))):(d.y0==0?d3.rgb(z(0)).darker():d3.rgb(z(1)).darker());});
					
			})
			.on("mouseout", function(d){
				masterBars.selectAll("text").remove();
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

		if(!SmallChart){
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
				
			svg.append("text")
				 .text("Number of graduated and not graduated students in Georgia Institute of Technology by high schools")
				 .attr("x", 70)
				 .attr("y", 13);

			svg.append("text")
			 .text("Hover over bar to see exact value, color: Grey = Graduated, Blue = Not Graduated")
			 .attr("x", 100)
			 .attr("y", 27);
		}
	}

  	var svg = d3.select('#completion').append('svg:svg')
  		.attr("width", w)
  		.attr("height", h)
  	  .append("svg:g")
  	  	.attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");
  	
  	// initialize, create and populate the globalTemp array.
  	var globalInfo = new Array();
  	var temp = {school: "", applied: "", accepted: "", percentageAccepted:"" };
  	var temp_applied, temp_accepted, temp_percentage_accepted;
	
	/*
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
  	*/
	if(HighSchoolGraduatedData == null){
		d3.tsv('data/CS4460_QueryHighSchoolData.tsv',function(error, data){
			// sort and get the number of graduated for each school using rollup function
			highSchoolsGraduated = d3.nest()
						.key(function(d)	{ return d["High School"];})
						.sortKeys(d3.ascending)
						.rollup(function(d){
						 return d3.sum(d, function(g)	{return g["Degree Status"] == "Graduated" ? 1 : 0;});
						}).entries(data);

			highSchoolsNotGraduated = d3.nest()
						.key(function(d)	{ return d["High School"];})
						.sortKeys(d3.ascending)
						.rollup(function(d){
						 return d3.sum(d, function(g)	{return g["Degree Status"] == "Not Graduated" ? 1 : 0;});
						}).entries(data);

			var highSchools = new Array();

			// initialize an array that have all 3 necessary fields
			var schools = {highSchoolsName: "", graduated: "", notGraduated:"" };
			// populate the schools array
			for(i = 0; i < highSchoolsGraduated.length; i++){
				schools = {highSchoolsName:highSchoolsGraduated[i].key, graduated: highSchoolsGraduated[i].values, notGraduated: highSchoolsNotGraduated[i].values};
				highSchools.push(schools);
			}

			// Transpose the data into layers by status
			highSchools = d3.layout.stack()(["graduated", "notGraduated"].map(function(status){
				return highSchools.map(function(d){
					return{x: d.highSchoolsName, y: +d[status]};
				});
			}));
			highSchools[0].sort(function(b, a){
				var indexofA = highSchools[0].indexOf(a);
				var indexofB = highSchools[0].indexOf(b);
				return (highSchools[0][indexofA].y + highSchools[1][indexofA].y) - (highSchools[0][indexofB].y + highSchools[1][indexofB].y);
			});
			console.log(highSchools);
				
			highSchools[1].sort(function(b, a){
				var indexofA = highSchools[1].indexOf(a);
				var indexofB = highSchools[1].indexOf(b);
				return (highSchools[0][indexofA].y + highSchools[1][indexofA].y) - (highSchools[0][indexofB].y + highSchools[1][indexofB].y);
			});
				
			HighSchoolGraduatedData = highSchools;
			
			drawTheChart();
		});
	}else{
		drawTheChart();
	}
}