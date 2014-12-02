function drawAgeChart(Width, Height) {
    var chart;
    var height = Height;
    var width = Width;

    var margin = {top: 15, right: 50, bottom: 30, left: 35},
        width = Width - margin.left - margin.right,
        height = Height - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    //todo: color fix
    var color = d3.scale.category20();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#ageChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv('data/CS4460_Demographics_Age - Copy.csv', function (error, data) {
        color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "Age";
        }));

        data.forEach(function (d) {
            var y0 = 0;
            d.ages = color.domain().map(function (age) {
                return {name: age, y0: y0, y1: y0 += +d[age]};
            });
            d.total = d.ages[d.ages.length - 1].y1;
        });

        //data.sort(function (a, b) {
        //    return b - a;}
        //);

        x.domain(data.map(function (d) {
            console.log(d);
            return d.Age;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.total;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .style("font-size", 12);


        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 2.5)
            .attr("dy", ".5em")
            .style("text-anchor", "end")
            .text("Number of Students")
            .style("font-size", 12);


        var age = svg.selectAll(".age")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x(d.Age) + ",0)";
            });

        age.selectAll("rect")
            .data(function (d) {
                return d.ages;
            })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.y1);
            })
            .attr("height", function (d) {
                return y(d.y0) - y(d.y1);
            })
            .style("fill", function (d) {
                return color(d.name);
            });

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", Width - margin.left - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", Width - margin.left - 21)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .style("font-size", 12)
            .text(function (d) {
                return d;
            });
    });
}
