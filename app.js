var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data2.csv", function (err, csvData) {
  if (err) throw err;

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  csvData.forEach(function (data) {
    data.total_median_earnings = +data.total_median_earnings;
    data.yes_limited_activity = +data.yes_limited_activity;
  });
  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
  .domain(d3.extent(csvData, data =>data.yes_limited_activity))
    .range([0,width]) // what you have on screen

  var yLinearScale = d3.scaleLinear()
  .domain(d3.extent(csvData, data =>data.total_median_earnings))
    .range([height, 0]); // scale define from top to bottom for y axis

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale)   

  var leftAxis = d3.axisLeft(yLinearScale);




  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append('g')
  .attr('transform', `translate(0,${height})`)
  .call(bottomAxis);

  //y axis
  chartGroup.append('g')
  .call(leftAxis);

  // Step 5: Create Circles
  // ==============================

  var circlesGroup = chartGroup.selectAll("circle")
      .data(csvData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.yes_limited_activity))
      .attr("cy", d => yLinearScale(d.total_median_earnings))
      .attr("r", "10")
      .attr("fill", "pink")
      .attr("stroke-width", "1")
      .attr("stroke", "black")
      .attr('opacity', ".75")

  // Step 6: Initialize tool tip
  // ==============================

  var toolTip = d3.tip()
    .attr('class','tooltip')
    .offset([80,-60])
    .html(function(d){
      return (`<strong>${(d.state)}</strong><br>$${d.total_median_earnings}
       | ${(d.yes_limited_activity)}%  Adults who are limited<br>`)
    })
  
    

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);
  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================

  // can change mouseover to click
  circlesGroup.on('mouseover',function(d){
    toolTip.show(d)
  })
      // Step 4: Create "mouseout" event listener to hide tooltip
  .on('mouseout',function(d){
    toolTip.hide(d)
  })
  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Total Median Earnings ($)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("% 'Yes' : Adults who are limited in any activities because of physical, mental, or emotional problems");

 
    
});
