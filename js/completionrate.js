//Gets called when the page is loaded.
var HighSchoolGraduatedData = null;
var HighSchoolGraduationRects = new Object();
function drawcompletionrate(Width, Height, SmallChart){
	HighSchoolGraduationRects = new Object();
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
			.attr("x", function(d) {(HighSchoolGraduationRects[d.x]==undefined) ? HighSchoolGraduationRects[d.x] = [this] : HighSchoolGraduationRects[d.x].push(this); return x(d.x);})
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
				//masterBars.selectAll("rect")
					//.attr("fill", function(d){return d.x==highlightedHighSchool?(d.y0==0?d3.rgb(z(0)).brighter().brighter():d3.rgb(z(1)).brighter()):(d.y0==0?z(0):z(1))})
					//.attr("stroke", function(d){return d.x==highlightedHighSchool?(d.y0==0?d3.rgb(z(0)).brighter():d3.rgb(z(1))):(d.y0==0?d3.rgb(z(0)).darker():d3.rgb(z(1)).darker());});
				updateGraphs(d.x);
			})
			.on("mouseout", function(d){
				masterBars.selectAll("text").remove();
				updateGraphs(null, d.x);
			})
			.on("mousedown", function(d){
				if(SmallChart){
					switch(mainGraph){
						case "HighSchoolGPA":
							CompletionGraphTransition(true);
							mainGraph = "completion";
							GPAGraphTransition(false);
						break;
						case "HighSchoolSATScores":
							CompletionGraphTransition(true);
							mainGraph = "completion";
							SATGraphTransition(false);
						break;
					}
					
				}
			});
			rect.append("title").text(function(d){
				var finalString = d.x + "\n";
				var total = 0;
				HighSchoolGraduationRects[d.x].forEach(function(g, i){
					finalString += i==0?"Number of Non-graduated: ":"Number of Graduated: ";
					finalString += d3.select(g)[0]['0'].__data__.y + (d3.select(g)[0]['0'].__data__.y==0?" :(":"") +"\n";
					total += d3.select(g)[0]['0'].__data__.y;
				});
				finalString += "Total students: " + total + "\n";
				return finalString + globalInfo[((d.x == "North Springs Charter Hs") ? "North Springs High School":d.x)].percentageAccepted + "% Acceptance rate";
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

  	var svg = d3.select('#completion').append('svg')
  		.attr("width", w)
  		.attr("height", h)
  	  .append("g")
  	  	.attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");
		
	var redrawBig = function(){
		drawcompletionrate(800, 600, false);
	};
	var redrawSmall = function(){
		drawcompletionrate(300, 300, true);
	};
	CompletionGraphTransition = function(toBigGraph){
		if(!toBigGraph){
			d3.select("#completion").select('svg').transition()
				.duration(750)
				.attr("height", 300)
				.attr("width", 300)
				.attr("transform", "scale(0.375, 0.5)")
				.each("end", redrawSmall)
				.remove();
			d3.select("#completion")
				.transition()
				.duration(750)
				.style("left", d3.select('#'+mainGraph).style("left"))
				.style("top", d3.select('#'+mainGraph).style("top"));
		}else{
			d3.select("#completion").select('svg').transition()
				.duration(750)
				.attr("height", 600)
				.attr("width", 800)
				.attr("transform", "scale(2.6666, 2)")
				.each("end", redrawBig)
				.remove();
			d3.select("#completion")
				.transition()
				.duration(750)
				.style("left", '300px')
				.style("top", '35px');
		}
		console.log(d3.select('#'+mainGraph).style("top"));
	}
  	
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

function updateGraphs(newHover = null, oldHover = null, newSelection = null){
	if(newHover != null){
		SATRectContainer[newHover].forEach(function(g, i){
			d3.select(g)
				.attr("fill", d3.rgb(d3.scale.category10().domain([0, 1, 2])(i)).brighter().brighter());
		});
		
		HighSchoolGraduationRects[newHover].forEach(function(g, i){
			d3.select(g)
				.attr("fill", d3.rgb(d3.scale.ordinal().range(["#fd8d3c", "#9ecae1"])(i)).brighter())
				.attr("stroke", d3.rgb(d3.scale.ordinal().range(["#fd8d3c", "#9ecae1"])(i)));
		});
		
		HighSchoolGPARects[newHover].forEach(function(g, i){
			d3.select(g)
				.attr("fill", "red");
		});
	}
	
	if(oldHover != null){
		SATRectContainer[oldHover].forEach(function(g, i){
			d3.select(g)
				.attr("fill", d3.rgb(d3.scale.category10().domain([0, 1, 2])(i)));
		});
		
		HighSchoolGraduationRects[oldHover].forEach(function(g, i){
			d3.select(g)
				.attr("fill", d3.rgb(d3.scale.ordinal().range(["#fd8d3c", "#9ecae1"]).domain([0, 1])(i)))
				.attr("stroke", d3.rgb(d3.scale.ordinal().range(["#fd8d3c", "#9ecae1"]).domain([0, 1])(i)).darker());
		});
		
		HighSchoolGPARects[oldHover].forEach(function(g, i){
			d3.select(g)
				.attr("fill", "black");
		});
	}
}