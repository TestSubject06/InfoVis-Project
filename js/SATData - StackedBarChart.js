/**
 * Created by Sabrina on 11/13/2014.
 */
function drawSATChart(Width, Height) {
    var chart;
    var height = Height;
    var width = Width;

    var math
    var verbal
    var writing
    var scores

    var margin = {top: 15, right: 50, bottom: 30, left: 35},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var color = d3.scale.category20();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv('data/CS4460_QueryHighSchoolData.tsv', function (error, data) {

        var scores = d3.nest()
            .key(function (d) {
                return d["High School"];
            })
            .sortKeys(d3.ascending)
            .rollup(function (d) {
                return {
                    math: d3.mean(d, function (g) {
                        return +g.SATMath
                    }),
                    reading: d3.mean(d, function (g) {
                        return +g.SATReading
                    }),
                    writing: d3.mean(d, function (g) {
                        return +g.SATWriting
                    })
                }
            })
            .entries(data);

//        data.forEach(function (d) {
//            var y0 = 0;
//            d.ages = color.domain().map(function (age) {
//                return {name: age, y0: y0, y1: y0 += +d[age]};
//            });
//            d.total = d.ages[d.ages.length - 1].y1;
//        });
//
//        //data.sort(function (a, b) {
//        //    return b - a;}
//        //);
//
//        x.domain(data.map(function (d) {
//            console.log(d);
//            return d.Age;
//        }));
//        y.domain([0, d3.max(data, function (d) {
//            return d.total;
//        })]);

//        svg.append("g")
//            .attr("class", "x axis")
//            .attr("transform", "translate(0," + height + ")")
//            .call(xAxis);
//
//        svg.append("g")
//            .attr("class", "y axis")
//            .call(yAxis)
//            .append("text")
//            .attr("transform", "rotate(-90)")
//            .attr("y", 2.5)
//            .attr("dy", ".71em")
//            .style("text-anchor", "end")
//            .text("SAT Score");
//
//        var age = svg.selectAll(".age")
//            .data(data)
//            .enter().append("g")
//            .attr("class", "g")
//            .attr("transform", function (d) {
//                return "translate(" + x(d.Age) + ",0)";
//            });
//
//        age.selectAll("rect")
//            .data(function (d) {
//                return d.ages;
//            })
//            .enter().append("rect")
//            .attr("width", x.rangeBand())
//            .attr("y", function (d) {
//                return y(d.y1);
//            })
//            .attr("height", function (d) {
//                return y(d.y0) - y(d.y1);
//            })
//            .style("fill", function (d) {
//                return color(d.name);
//            });
//
//        var legend = svg.selectAll(".legend")
//            .data(color.domain().slice().reverse())
//            .enter().append("g")
//            .attr("class", "legend")
//            .attr("transform", function (d, i) {
//                return "translate(0," + i * 20 + ")";
//            });
//
//        legend.append("rect")
//            .attr("x", Width - margin.left - 18)
//            .attr("width", 18)
//            .attr("height", 18)
//            .style("fill", color);
//
//        legend.append("text")
//            .attr("x", Width - margin.left - 21)
//            .attr("y", 9)
//            .attr("dy", ".35em")
//            .style("text-anchor", "end")
//            .text(function (d) {
//                return d;
//            });
    });
}
