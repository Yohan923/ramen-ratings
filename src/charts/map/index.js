import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath, scaleDiverging, svg } from 'd3';

var Color = require('color');
var mapData = require('../../data/combined_geo.json');
var all_data = require('../../data/country_data.json');



const Map = (props) => {
  var data = mapData.features;
  const svgRef = useRef();
  const projection = geoMercator().fitSize([900, 600], mapData).precision(100)
  const pathGenerator = geoPath().projection(projection);

  // set the dimensions and margins of the graph
 var margin = {top: 0, right: 30, bottom: 0, left: 40},
 width = 900,
 height = 600;

  useEffect(() => {

    var tooltip = d3.select(svgRef.current)
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")
      .style("position", "absolute")

      // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d, i) {
  tooltip
    .transition()
    .duration(200)
  tooltip
    .style("opacity", 1)
    .html("Country " + i.properties.ADMIN + ", " + "Number: " + (i.num_ramen !== undefined? i.num_ramen: 0))
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
    
    var svg = d3.select(svgRef.current)

    const zoom = d3.zoom()
    .on('zoom', (event) => {
      map.attr('transform', event.transform);
    })
    .scaleExtent([1, 40]);

    var map = svg.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(zoom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    
    map.append('g')
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('class', 'country')
    .attr('fill', feature => {
      if (feature.num_ramen){
        var luminance = (((352 - feature.num_ramen)/(352 - 1)) * 40)+40
        return Color.hsl(120, 50, luminance)
      }
      else{
        return 'grey'
      }  
    })
    .attr('stroke', 'black')
    .attr('d', feature => pathGenerator(feature))
    .on('click', (event, feature) => {
      if (all_data[feature.properties.ADMIN] !== undefined){
        props.handler(feature.properties.ADMIN)
      }else if (all_data[feature.properties.ISO_A3] !== undefined){
        props.handler(feature.properties.ISO_A3)
      }
      
    })
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )
    .enter()
    .append('path');


    map.selectAll('text')
    .data(data)
    .enter().append("text")
    .attr('class', 'text')
    .attr('d', feature => pathGenerator(feature))
    .attr("x", function(d) {
      if (d.properties.ADMIN == 'United States of America'){
        return pathGenerator.centroid(d)[0] + 15
      }
      else if (d.properties.ADMIN == 'Canada'){
        return pathGenerator.centroid(d)[0] - 30
      }
      else{
        return pathGenerator.centroid(d)[0] - 10;
      }
    })
    .attr("y", function(d) {
      if (d.properties.ADMIN == 'United States of America'){
        return pathGenerator.centroid(d)[1] + 40
      }
      else if (d.properties.ADMIN == 'Canada'){
        return pathGenerator.centroid(d)[1] + 45
      }
      else{
        return pathGenerator.centroid(d)[1];
      }
    })
    .attr("font-size", "5px")
    .on('click', (event, feature) => {
      if (all_data[feature.properties.ADMIN] !== undefined){
        props.handler(feature.properties.ADMIN)
      }else if (all_data[feature.properties.ISO_A3] !== undefined){
        props.handler(feature.properties.ISO_A3)
      }
      
    })
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )
    .text(feature => {
      return feature.num_ramen ? feature.properties.ADMIN : ''
    });
    
  }, []);

  return <div style={{ width: '970px', height: '600px'}} ref={svgRef}/>;
};

export default Map;
