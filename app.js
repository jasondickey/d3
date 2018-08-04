d3.select(window).on('resize', makeResponsive);

makeResponsive();

function makeResponsive() {
    var svgArea = d3.select('body').select('svg');
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = { top: 20, right: 150, bottom: 100, left: 130 };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    
    var svg = d3
        .select('.chart')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var chart = svg.append("g");

    d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

    d3.csv("data/data.csv", function(err, six_five_data) {
    if (err) throw err;
    
    six_five_data.forEach(function(data) {
        data.allTeethRemoved = +data.allTeethRemoved;
        data.bachelorOrHigher = +data.bachelorOrHigher;
        data.white = +data.white;
        data.skinCancer = +data.skinCancer;
        data.foodStamp = +data.foodStamp;
        data.smoke = +data.smoke;
    });

    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    function findMinAndMax(dataColumnX, dataColumnY) {
        xMin = d3.min(six_five_data, function(data) {
        return +data[dataColumnX] * 0.8;
        });

        xMax = d3.max(six_five_data, function(data) {
        return +data[dataColumnX] * 1.1;
        });

        yMin = d3.min(six_five_data, function(data) {
        return +data[dataColumnY] * 0.8;
        });

        yMax = d3.max(six_five_data, function(data) {
        return +data[dataColumnY] * 1.1;
        });
    }

    var currentAxisLabelX = "bachelorOrHigher";
    var currentAxisLabelY = "allTeethRemoved";
    
    findMinAndMax(currentAxisLabelX, currentAxisLabelY);

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html(function(data) {
        var states = data.geography;
        var valueX = +data[currentAxisLabelX];
        var valueY = +data[currentAxisLabelY];
        var stringX;
        var stringY;
        
        if (currentAxisLabelX === "bachelorOrHigher") {
            stringX = "Bachelor: ";
            stringY = "No Teeth: ";
        }
        else if (currentAxisLabelX === "white") {
            stringX = "White People: ";
            stringY = "Skin Cancer: ";
        }
        else {
            stringX = "Food Stamp: "
            stringY = "Smoker: ";
        }
        return states +
            "<br>" +
            stringX +
            valueX +
            "<br>" +
            stringY +
            valueY;
        });
        
    chart.call(toolTip);
    
    chart
        .selectAll("circle")
        .data(six_five_data)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
        return xLinearScale(+data[currentAxisLabelX]);
        })
        .attr("cy", function(data, index) {
        return yLinearScale(+data[currentAxisLabelY]);
        })
        .attr("r", "18")
        .attr("fill", "lightblue")
        .attr("class", "circle")
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);
    
    chart
        .selectAll("text")
        .data(six_five_data)
        .enter()
        .append("text")
        .attr("x", function(data, index) {
          return xLinearScale(+data[currentAxisLabelX]);
        })
        .attr("y", function(data, index) {
          return yLinearScale(+data[currentAxisLabelY]);
        })
        .attr("dx", "-0.65em")
        .attr("dy", "0.4em")
        .style("font-size", "13px")
        .style("fill", "white")
        .attr("class", "abbr")
        .text(function(data, index) {
          return data.abbr;
        });

    chart
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x-axis")
        .call(bottomAxis);

    chart
        .append("g")
        .attr("class", "y-axis")
        .call(leftAxis);

    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 80)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text change")
        .attr("data-axis-name", "allTeethRemoved")
        .attr("id", "allTeethRemoved")
        .text("65+ with All Teeth Removed (%)");

    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 55)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text unchange")
        .attr("data-axis-name", "skinCancer")
        .attr("id", "skinCancer")
        .text("Had Skin Cancer (%)");

    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text unchange")
        .attr("data-axis-name", "smoke")
        .attr("id", "smoke")
        .text("Currently Smoking (%)");

    chart
        .append("text")
        .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
        )
        .attr("class", "axis-text active")
        .attr("data-axis-name", "bachelorOrHigher")
        .text("Education level: Bachelor or higher (%)");

    chart
        .append("text")
        .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
        )
        .attr("class", "axis-text inactive")
        .attr("data-axis-name", "white")
        .text("Race: White (%)");

    chart
        .append("text")
        .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 70) + ")"
        )
        .attr("class", "axis-text inactive")
        .attr("data-axis-name", "foodStamp")
        .text("Family gets food stamps (%)");

    function labelChange(clickedAxis, corrAxis) {
        d3
        .selectAll(".axis-text")
        .filter(".active")
        .classed("active", false)
        .classed("inactive", true);

        d3
        .selectAll(".axis-text")
        .filter(".change")
        .classed("change", false)
        .classed("unchange", true);

        clickedAxis.classed("inactive", false).classed("active", true);
        corrAxis.classed("unchange", false).classed("change", true);
    }

    d3.selectAll(".axis-text").on("click", function() {
        var clickedSelection = d3.select(this);
        var isClickedSelectionInactive = clickedSelection.classed("inactive");
        
        var clickedAxis = clickedSelection.attr("data-axis-name");
        
        var corrAxis;

        if (clickedAxis === "bachelorOrHigher") {
            corrAxis = d3.select("#allTeethRemoved");
        }
        else if (clickedAxis === "white") {
            corrAxis = d3.select("#skinCancer");
        }
        else {
            corrAxis = d3.select("#smoke");
        }

        if (isClickedSelectionInactive) {
        currentAxisLabelX = clickedAxis;
        currentAxisLabelY = corrAxis.attr("data-axis-name");
        findMinAndMax(currentAxisLabelX, currentAxisLabelY);
        xLinearScale.domain([xMin, xMax]);
        yLinearScale.domain([yMin, yMax]);

        svg
            .select(".x-axis")
            .transition()
            .duration(1800)
            .call(bottomAxis);

        svg
            .select(".y-axis")
            .transition()
            .duration(1800)
            .call(leftAxis);

        d3.selectAll("circle").each(function() {
            d3
            .select(this)
            .transition()
            .attr("cx", function(data) {
                return xLinearScale(+data[currentAxisLabelX]);
            })
            .attr("cy", function(data, index) {
                return yLinearScale(+data[currentAxisLabelY]);
            })
            .duration(1800);
        });

        d3.selectAll(".abbr").each(function() {
            d3
            .select(this)
            .transition()
            .attr("x", function(data) {
                return xLinearScale(+data[currentAxisLabelX]);
            })
            .attr("y", function(data, index) {
                return yLinearScale(+data[currentAxisLabelY]);
            })
            .duration(1800);
        });
        labelChange(clickedSelection, corrAxis);
        }
    });
    });
}