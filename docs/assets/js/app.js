function buildPlot() {

//defining height and width of plot, with margins
let boxWidth = 960;
let boxHeight = 500;

let margin = {
top: 20,
right: 40,
bottom: 80,
left:100
};

let width = boxWidth - margin.left - margin.right;
let height = boxHeight - margin.top - margin.bottom;

// Creating svg wrapper, & append svg group
let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", boxWidth)
    .attr("height", boxHeight);

let plotGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//getting data from csv
d3.csv("assets/data/data.csv")
    .then(function(DJData){

    DJData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.abbr = data.abbr;
    });

//creating x and y scales
    let xLinearScale = d3.scaleLinear()
        .domain([8.5, d3.max(DJData, d => d.poverty)])
        .range([0, width]);

    let yLinearScale = d3.scaleLinear()
        .domain([3.5, d3.max(DJData, d => d.healthcare)])
        .range([height, 0]);


//creating x and  y axis
    let xAxis = d3.axisBottom(xLinearScale);
    let yAxis = d3.axisLeft(yLinearScale);

//appending axis to plotGroup
    plotGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    plotGroup.append("g")
    .call(yAxis);
    
//Make markers
    let markersGroup = plotGroup.selectAll("circle")
        .data(DJData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("opacity", ".6")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

        //plots text in same place as markers
        plotGroup.select("g")
        .selectAll("circle")
        .data(DJData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy",-395)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black");
     
        console.log(DJData);
        
    //adding text on x and y labels
    plotGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 60)
      .attr("x", 0 -270)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacking Healthcare (%)");

    plotGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 25})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

});
}

buildPlot();