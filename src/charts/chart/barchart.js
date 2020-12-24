import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

var all_data = require('../../data/country_data.json');

const BarChart = (props) => {

    const svgRef = useRef();

    var height = 380
    var width = 450 

    var margin = {top: 10, right: 30, bottom: 30, left: 40}

    
    useEffect(() => {
      d3.select(svgRef.current).selectAll("*").remove()

      var svg = d3.select(svgRef.current)
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
      var data = Object.values(all_data[props.clickedCountry].packagings)

      var line = d3.line()
      .x(d => x(d.name) + x.bandwidth() / 2)
      .y(d => y2(d.average))
      
      var x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1)
  
      var y1 = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.num)])
      .rangeRound([height - margin.bottom, margin.top])
      
  
      var y2 = d3.scaleLinear()
      .domain(d3.extent(data, d => d.average))
      .rangeRound([height - margin.bottom, margin.top])
  
      var xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)
          .tickSizeOuter(0))
          .call(g => g.append("text")
          .attr("x", width - margin.right)
          .attr("y", 30)
          .attr("fill", "currentColor")
          .attr("font-weight", "bold")
          .attr("text-anchor", "end")
          .text('Packaging style'))
  
          var y1Axis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y1).ticks(null, "s"))
      .call(g => g.select(".domain"))
      .call(g => g.append("text")
          .attr("x", -margin.left)
          .attr("y", 0)
          .attr("font-weight", "bold")
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text('Number of ramen products'))
  
          var y2Axis = g => g
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(y2))
      .call(g => g.select(".domain"))
      .call(g => g.append("text")
          .attr("x", margin.right)
          .attr("y", 0)
          .attr("font-weight", "bold")
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text('Average Stars'))

  svg.append("g")
      .attr("fill", "steelblue")
      .attr("fill-opacity", 0.8)
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", d => y1(d.num))
      .attr("height", d => y1(0) - y1(d.num));

  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-miterlimit", 1)
      .attr("stroke-width", 3)
      .attr("d", line(data));

  svg.append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", 0)
      .attr("height", height)
    .append("title")
      .text('helloWorld');

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(y1Axis);

  svg.append("g")
      .call(y2Axis);
    

    }, [props.clickedCountry]);

    return (<div style={{flexGrow: '4', borderStyle: 'groove'}}>
      <div style={{height: '30px' , fontWeight: 'bold', borderStyle: 'solid'}}>The number of ramen and average rating of packaging styles</div>
      <div style={{ width: '600px', height: '400px'}} ref={svgRef}/>
    </div>);

}

export default BarChart;