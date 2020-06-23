// @TODO: YOUR CODE HERE!
var svgWidth = 690;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrappers.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("https://raw.github.com/keng85/d3-challenge-update/master/assets/data/data.csv")
  .then(function(data) {
  	console.log(data)
    // Parse Data/Cast as numbers

    data.forEach(function(d) {
      d.abbr = d.abbr;
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
    });

    //  scale functions

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty)-1, d3.max(data, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.healthcare)-1, d3.max(data, d => d.healthcare)])
      .range([height, 0]);

    // Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles

    var circlesGroup = chartGroup.selectAll("circle").data(data).enter()
    circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", "0.8");

    circlesGroup.append("text").text(function(d){
      return d.abbr;
    }).attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare)+10/2.5)
    .attr("font-size","9")
    .attr("class","stateText")
    .on("mouseover", function(data, index) {
      
      toolTip.show(data,this);
    d3.select(this).style("stroke","#323232")
    .style("stroke-width","10")
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data,this)
     d3.select(this).style("stroke","#e3e3e3")
    });

    // var labelGroup = chartGroup.selectAll("label")
    // // .data(data)
    // .enter()
    // .append("text")
    // .text(d => d.abbr)
    // .attr("font-size",9)
    // .attr("font-weight","bold")
    // .attr("fill", "white")
    // .attr("x", d => xLinearScale(d.income)-5)
    // .attr("y", d => yLinearScale(d.obesity)+5);
   
    //  tool tip

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br> Healthcare: ${d.healthcare}%`);
      });

    // call tooltip in the chart

    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip

    // labelGroup.on("mouseover", function(d) {
    //   toolTip.show(d, this);
    // })
    //   // onmouseout event
    //   .on("mouseout", function(d, index) {
    //     toolTip.hide(d);
    //   });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty");
  });