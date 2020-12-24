import React, { useState, useEffect, useRef, useMemo, Component} from 'react';
import * as d3 from 'd3';

var all_data = require('../../data/country_data.json');

const Bubble = (props) => {

    const svgRef = useRef();
    const divRef = useRef();
    useEffect(() => {
      d3.select(svgRef.current).selectAll("*").remove()

// set the dimensions and margins of the graph
 var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 450,
    height = 380;

// append the svg object to the body of the page
var svg = d3.select(svgRef.current)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    
    var data = Object.values(all_data[props.clickedCountry].brands)

    
    var tooltip = d3.select(svgRef.current)
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")
      .style("position", "absolute")
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, Math.ceil(Math.max.apply(Math, data.map(function(o) { return o.num; }))/10)*10])
    .range([margin.left, width - margin.right]);



  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 5])
    .range([height - margin.bottom, margin.top]);


    var xAxis = g => g
    .call(d3.axisBottom(x))
    .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", 30)
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text('Number of products'))

  var yAxis = g => g

    .call(d3.axisLeft(y))
    .call(g => g.select(".domain"))
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", -50)
        .attr("y", -15)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text('Average Stars'))

        svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

        svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([1, 400])
    .range([ 5, 40]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeSet2);

  // -1- Create a tooltip div that is hidden by default:


  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d, i) {
      var tmp =d3.pointer(d)
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Brand: " + i.name + ", " + "Number: " + i.num + ", " + "Average: " + i.average)
      .style("left", (d.x) + "px")
      .style("top", (d.y - 50) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d.x) + "px")
      .style("top", (d.y - 50) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(d.num); } )
      .attr("cy", function (d) { return y(d.average); } )
      .attr("r", function (d) { return z(d.num); } )
      .style("fill", function (d) { return myColor(d.name); } )
    // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

    }, [props.clickedCountry]);

    return (
      <div style={{flexGrow: '4', borderStyle: 'groove'}}>
              <div style={{height: '30px' , fontWeight: 'bold', borderStyle: 'solid'}}>Distribution of ramen product brands</div>
              <div style={{ width: '600px', height: '400px' }} ref={svgRef}>
    </div>
      </div>
);

}

export default Bubble