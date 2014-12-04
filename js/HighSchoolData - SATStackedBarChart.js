var HighSchoolSATRolledup = null;
var SATRectContainer = new Object();
function drawHighSchoolSAT(Width, Height, SmallChart){
	SATRectContainer = new Object();
	var chart;
	var margin = SmallChart ? {top:5, bottom:5, left:5, right:5} : {top:10, bottom:40, left:40, right:10};
	var chartWidth = Width-margin.left-margin.right;
	var chartHeight = Height-margin.top-margin.bottom;
	var x;
	var y;
	var yAxisLabel;
	var xAxisLabel;
	var color = d3.scale.category10();
	
	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
				
	chart = d3.select('#HighSchoolSATScores').append('svg');
	
	x = d3.scale.ordinal()
		.rangeBands([chartWidth, 0]);
	
	y = d3.scale.linear()
		.range([0, chartHeight]);
		
	chart = chart.attr("width", Width)
		.attr("height", Height)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	var redrawBig = function(){
		drawHighSchoolSAT(640, 480, false);
	};
	var redrawSmall = function(){
		drawHighSchoolSAT(200, 240, true);
	};
	SATGraphTransition = function(toBigGraph){
		if(!toBigGraph){
			chart.transition()
				.duration(750)
				.attr("transform", "scale(0.375, 0.5)")
				.each("end", redrawSmall);
			d3.select("#HighSchoolSATScores").select('svg')
				.transition()
				.duration(750)
				.attr("height", 240)
				.attr("width", 200)
				.remove();
			d3.select("#HighSchoolSATScores")
				.transition()
				.duration(750)
				.style("left", d3.select('#'+mainGraph).style("left"))
				.style("top", d3.select('#'+mainGraph).style("top"));
		}else{
			chart.transition()
				.duration(750)
				.attr("transform", "scale(2.6666, 2)")
				.each("end", redrawBig);
			d3.select("#HighSchoolSATScores").select('svg')
				.transition()
				.duration(750)
				.attr("height", 480)
				.attr("width", 640)
				.remove();
			d3.select("#HighSchoolSATScores")
				.transition()
				.duration(750)
				.style("left", '200px')
				.style("top", '30px');
		}
	}
		
	var drawChart = function(){
		// Compute the x-domain by name of highschools and y-domain by top
		x.domain(HighSchoolSATRolledup[0].map(function(d) {return d.x;}));
		y.domain([0, d3.max(HighSchoolSATRolledup[HighSchoolSATRolledup.length - 1], function(d) {return d.y0 + d.y;})]);
		color.domain([0, 1, 2]);

		// Add a group for each status
		var masterBars = chart.append("g").attr("transform", "translate(0, "+chartHeight+")scale(1, 1)");
		var status = masterBars.selectAll("g.status")
			.data(HighSchoolSATRolledup)
		  .enter().append("g")
			.attr("class", "status")
			.style("fill", function(d, i) {return color(i)});
		// Add a rect for each high school
		var rect = status.selectAll("rect")
			.data(Object)
		  .enter().append("rect")
			.attr("x", function(d) {(SATRectContainer[d.x]==undefined) ? SATRectContainer[d.x] = [this] : SATRectContainer[d.x].push(this); return x(d.x);})
			.attr("y", function(d) {return -y(d.y0) - y(d.y); })//y(d.y0);})
			.attr("height", function(d) {return y(d.y);})
			.attr("width", x.rangeBand())
			.on("mouseover", function(d) {
				//SATRectContainer[d.x].forEach(function(g, i){
					//d3.select(g)
						//.attr("fill", d3.rgb(color(i)).brighter().brighter());
				//});
				if(!SmallChart){
					masterBars.append("text")
						.attr("x", d3.mouse(this)[0])
						.attr("y", d3.mouse(this)[1]-15)
						.style("text-anchor", "middle")
						.style("font", "10px sans-serif")
						.style("fill", "black")
						.text(function() {return d.x + " " + Math.round(d.y) ;});
				}
				highlightedHighSchool = d3.select(this)[0]['0'].__data__.x;
				
				updateGraphs(d.x); 
			})
			.on("mouseout", function(d){
				masterBars.selectAll("text").remove();
				//SATRectContainer[d.x].forEach(function(g, i){
					//d3.select(g)
						//.attr("fill", color(i));
				//});
				updateGraphs(null, d.x);
			})
			.on("mousedown", function(d){
				if(SmallChart){
					switch(mainGraph){
						case "HighSchoolGPA":
							SATGraphTransition(true);
							mainGraph = "HighSchoolSATScores";
							GPAGraphTransition(false);
						break;
						case "completion":
							SATGraphTransition(true);
							mainGraph = "HighSchoolSATScores";
							CompletionGraphTransition(false);
						break;
					}
					
				}
			});
			
			rect.append("title").text(function(d){
				var finalString = d.x + "\n";
				var someInt = 0;
				SATRectContainer[d.x].forEach(function(g, i){
					finalString += i==0?"Average SAT Math: ":(i==1?"Average SAT Verbal: ":"Average SAT Written: ");
					finalString += Math.round(someInt = d3.select(g)[0]['0'].__data__.y) + (someInt==0?" :(":"") +"\n";
				});
				return finalString + globalInfo[((d.x == "North Springs Charter Hs") ? "North Springs High School":d.x)].percentageAccepted + "% Acceptance rate";
			});
	}
		
	if(HighSchoolSATRolledup == null){
		d3.tsv("data/CS4460_QueryHighSchoolData.tsv", function(error, data){
			var SATMath = d3.nest()
							.key(function(d){ return d["High School"];})
							.sortKeys(d3.ascending)
							.rollup(function(d){
								return {math: d3.mean(d, function(g){return +g["SATMath"];}), verbal: d3.mean(d, function(g){return +g["SATVerbal"];}), writing: d3.mean(d, function(g){return +g["SATWriting"];})};
							}).entries(data);
			
			var SATStack = d3.layout.stack()(["math", "verbal", "writing"].map(function(category){
				return SATMath.map(function(d){
					return {x: d.key, y:d.values[category]}
				});
			}));
			
			SATStack[0].sort(function(a, b){
				var indexofA = SATStack[0].indexOf(a);
				var indexofB = SATStack[0].indexOf(b);
				return (SATStack[0][indexofA].y + SATStack[1][indexofA].y + SATStack[2][indexofA].y) - (SATStack[0][indexofB].y + SATStack[1][indexofB].y + SATStack[2][indexofB].y);
			});
			
			SATStack[1].sort(function(a, b){
				var indexofA = SATStack[1].indexOf(a);
				var indexofB = SATStack[1].indexOf(b);
				return (SATStack[0][indexofA].y + SATStack[1][indexofA].y + SATStack[2][indexofA].y) - (SATStack[0][indexofB].y + SATStack[1][indexofB].y + SATStack[2][indexofB].y);
			});
			
			SATStack[2].sort(function(a, b){
				var indexofA = SATStack[2].indexOf(a);
				var indexofB = SATStack[2].indexOf(b);
				return (SATStack[0][indexofA].y + SATStack[1][indexofA].y + SATStack[2][indexofA].y) - (SATStack[0][indexofB].y + SATStack[1][indexofB].y + SATStack[2][indexofB].y);
			});
			HighSchoolSATRolledup = SATStack;
			drawChart();
		});
	}else{
		drawChart();
	}
}