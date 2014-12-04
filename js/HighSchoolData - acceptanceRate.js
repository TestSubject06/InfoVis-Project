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