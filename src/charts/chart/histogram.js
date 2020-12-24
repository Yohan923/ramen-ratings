import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

var all_data = require('../../data/country_data.json');

const Histogram = (props) => {

    const svgRef = useRef();
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 450,
        height = 380;
    useEffect(() => {
        d3.select(svgRef.current).selectAll("*").remove()
    // append the svg object to the body of the page
    var svg = d3.select(svgRef.current)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    var data = all_data[props.clickedCountry].stars
    var bins = d3.bin().thresholds([0, 1, 2, 3, 4, 5])(data)

            var x = d3.scaleLinear()
            .domain([0, 5])
            .range([margin.left, width - margin.right])

            var y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)]).nice()
    .range([height - margin.bottom, margin.top])


    var xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80 ).tickSizeOuter(0))
    .call(g => g.append("text")
    .attr("x", width - margin.right)
    .attr("y", 30)
    .attr("fill", "currentColor")
    .attr("font-weight", "bold")
    .attr("text-anchor", "end")
        .text('Stars'))


    svg.append("g")
    .attr("fill", "steelblue")
  .selectAll("rect")
  .data(bins)
  .join("rect")
    .attr("x", d => x(d.x0) + 1)
    .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
    .attr("y", d => y(d.length))
    .attr("height", d => y(0) - y(d.length));


    var yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(height / 40).tickSizeOuter(0))
    .call(g => g.select(".domain"))
    .call(g => g.select(".tick:last-of-type text").clone()
    .attr("x", -50)
    .attr("y", -15)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text('Ramen products'))

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);

    // And apply this function to data to get the bins


    }, [props.clickedCountry]);

    return (
        <div style={{flexGrow: '4', borderStyle: 'groove'}}>
        <div style={{height: '30px' , fontWeight: 'bold', borderStyle: 'solid'}}>Distribution of ramen product ratings</div>
        <div style={{ width: '600px', height: '400px' }} ref={svgRef}/>
        </div>
    );

}

export default Histogram;