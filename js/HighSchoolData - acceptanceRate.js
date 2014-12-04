var HighSchoolNameBoxRects = new Object();
function collectAcceptanceRate(){
	// initialize, create and populate the globalTemp array.
  	globalInfo = new Object();
  	var temp = {school: "", applied: "", accepted: "", percentageAccepted:"" };
  	var temp_applied, temp_accepted, temp_percentage_accepted;
	
  	d3.tsv('data/CS4460_HighSchoolAcceptanceRates_v2.tsv', function(error, data){
  		temp_applied = d3.nest()
				.key(function(d)	{ return d["High School Description"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.sum(d, function(g)	{return +g.Applied;});
				}).entries(data);
		temp_accepted = d3.nest()
				.key(function(d)	{ return d["High School Description"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.sum(d, function(g)	{return +g.Accepted;});
				}).entries(data);
		temp_percentage_accepted = d3.nest()
				.key(function(d)	{ return d["High School Description"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.mean(d, function(g)	{return +g["Percentage Accepted"];});
				}).entries(data);
		for(i = 0; i < temp_applied.length; i++){
			temp = {school:temp_applied[i].key, applied: temp_applied[i].values, accepted: temp_accepted[i].values, percentageAccepted: temp_percentage_accepted[i].values};
			globalInfo[temp_applied[i].key] = {applied: temp_applied[i].values, accepted: temp_accepted[i].values, percentageAccepted: temp_percentage_accepted[i].values};
		}
	});
	
}

function drawNameBoxes(){	
	var list = d3.select("#TextArea").append('svg')
		.attr("height", "258")
		.attr("width", "840");
	
	var nameBoxes = list.selectAll('HighSchools')
		.data(HighSchoolSpecialRollupData)
		.enter().append('g')
			.attr("class", "HighSchoolNameBox");
			
	var rects = nameBoxes.append('rect')
			.attr("width", "100px")
			.attr("height", "11px")
			.attr("y", function(d, i){(HighSchoolNameBoxRects[d.key]==undefined) ? HighSchoolNameBoxRects[d.key] = [this] : HighSchoolNameBoxRects[d.key].push(this); return (i%23)*11+6;})
			.attr("x", function(d, i){return Math.floor(i/23)*103;})
			.attr("fill", function(d){return "white";})
			.on("mouseover", function(d){
				//d3.select(this)
					//.attr("fill", "red");
					
				//d3.select(this.parentNode)
					//.append("text")
					//.attr("transform", "translate(-5, 5)")
					//.style("text-anchor", "end")
					//.style("font", "10px sans-serif")
					//.style("fill", "blue")
					//.text(function(d){return d.key;});
					
				//highlightedHighSchool = d3.select(this)[0]['0'].__data__.key;
				updateGraphs(d.key);
			})
			.on("mouseout", function(d){
				//d3.select(this)
					//.attr("fill", function(d){return (selectedHighSchools.indexOf(d.key)>=0) ? "steelblue" : "black";});
					
				//bar.select("text").remove();
				updateGraphs(null, d.key);
			})
			.on("mousedown", function(){
				//d3.select(this)
					//.attr("fill", function(d){selectedHighSchools[0] = d.key; return "steelblue"});
				//bar.selectAll("rect").attr("fill", function(d){return (selectedHighSchools.indexOf(d.key)>=0) ? "steelblue" : "black";});
			});
	rects.append("title").text(function(d){
				return d.key;
				//return d.key + "\n" + "Average GPA: " + Math.round(d.values*100)/100 + "\n" + globalInfo[((d.key == "North Springs Charter Hs") ? "North Springs High School":d.key)].percentageAccepted + "% Acceptance rate";
			});
			
	nameBoxes.append('text')
		.attr("y", function(d, i){(HighSchoolNameBoxRects[d.key]==undefined) ? HighSchoolNameBoxRects[d.key] = [this] : HighSchoolNameBoxRects[d.key].push(this); return (i%23)*11+16;})
		.attr("x", function(d, i){return Math.floor(i/23)*103+1;})
		.style("font", "10px sans-serif")
		.style("fill", "black")
		.style("pointer-events", "none")
		.text(function(d){return d.key.split(" ")[0] +" "+ d.key.split(" ")[1];});
		
}