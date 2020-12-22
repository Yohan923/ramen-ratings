import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath, scaleDiverging, svg } from 'd3';

var Color = require('color');
var mapData = require('../../data/combined_geo.json');

var clickedCountry = '';

const setClicked = (d) => {
  clickedCountry = d.properties.ADMIN;
}

const Map = (props) => {
  var data = mapData.features;
  const svgRef = useRef();
  const projection = geoMercator().fitSize([1000, 800], mapData).precision(100)
  const pathGenerator = geoPath().projection(projection);

  useEffect(() => {
    d3.select(svgRef.current)
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
    .on('click', (event, feature) => setClicked(feature))
    .enter()
    .append('path');
  }, [data]);
  
  useEffect(() => {
    d3.select(svgRef.current)
    .selectAll('text')
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
    .text(feature => {
      return feature.num_ramen ? feature.properties.ADMIN : ''
    });
  }, [data]);

  return <svg style={{ width: '1000px', height: '800px' , backgroundColor: 'rgb(0, 66, 173)'}} ref={svgRef}/>;
};

export default Map;
