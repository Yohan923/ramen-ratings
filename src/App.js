import React, { useEffect, useState, useRef } from 'react';
import { Layout } from 'antd';
import Map from './charts/map/index';
import './App.css';
const { Sider, Content, Footer } = Layout;


function App() {
  return (
    <div className="App">
      <Layout>
        <Content style={{ height: 300 }}>
          View 1
        </Content>
        <Layout style={{ height: 600 }}>
          <Sider style={{backgroundColor:'#eee'}}>
            View 3
          </Sider>
          <Content>
            <Map></Map>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
