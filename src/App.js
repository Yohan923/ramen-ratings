import React, { useEffect, useState, useRef } from 'react';
import { Layout } from 'antd';
import Map from './charts/map/index';
import Histogram from "./charts/chart/histogram";
import BarChart from "./charts/chart/barchart";
import L from "./charts/chart/list";
import Bubble from "./charts/chart/bubble";
import Button from "./button";
import './App.css';
const { Sider, Content, Footer } = Layout;


function App() {
  const [clickedCountry, setCountry] = useState('China')

  return (
    <div className="App">
      <div className='charts'>
        <Histogram clickedCountry={clickedCountry}/>
        <Bubble clickedCountry={clickedCountry}/>
        <BarChart clickedCountry={clickedCountry}/>
        <L clickedCountry={clickedCountry}/>
      </div>
      <div style={{ width: '100%', borderStyle: 'groove'}} className='map'>
        <div className='leftBox'>
          <div style={{borderStyle: 'solid', marginBottom: '10px', textAlign: 'center', verticalAlign: 'middle', padding: '10px 5px'}}>Currently showing data for {clickedCountry !== 'world'? clickedCountry : 'all countries'}</div>
          <Button handler={setCountry}></Button>
        </div>
       <Map handler={setCountry}></Map>
       <div className='legend'>
         <div>
           Number of ramen products
         </div>
        <div className='box'> 
        <div>
          352
        </div>
        <div>
          1
          </div>
        </div>
        <div>No Data</div>
        <div style={{height: '30px', backgroundColor:'grey'}}>
        </div>
       </div>
      </div>
    </div>
  );
}

export default App;
