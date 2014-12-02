function highSchoolInfo(){
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
				//console.log(temp_applied);
				//console.log(temp_applied.length);
		temp_accepted = d3.nest()
				.key(function(d)	{ return d["High School Description"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.sum(d, function(g)	{return g.Accepted;});
				}).entries(data);
				//console.log(temp_accepted);
				//console.log(temp_accepted.length);
		temp_percentage_accepted = d3.nest()
				.key(function(d)	{ return d["High School Description"];})
				.sortKeys(d3.ascending)
				.rollup(function(d){
				 return d3.sum(d, function(g)	{return g["Percentage Accepted"];});
				}).entries(data);
				//console.log(temp_percentage_accepted);
				//console.log(temp_percentage_accepted.length);
		// populate the globalInfo array
		for(i = 0; i < temp_applied.length; i++){
			temp = {school:temp_applied[i].key, applied: temp_applied[i].values, accepted: temp_accepted[i].values, percentageAccepted: temp_percentage_accepted[i].values};
			globalInfo.push(temp);
		}
		console.log(globalInfo);
	});
  	
}