import React, { Component } from "react";

var all_data = require('../../data/country_data.json');


const L = (props) => {

    const returnText = () =>{
        if (all_data[props.clickedCountry].top_10s.length > 0){
            return all_data[props.clickedCountry].top_10s.map(({ Brand, Variety, Stars}) => {
                return (
                    <div className="item">
                      Brand: {Brand},
                      Variety: {Variety},
                      Rating: {Stars}
                    </div>
                );
              })
        }else{
            return 'No products has been featured here'
        }
    }

    return (
      <div style={{flexGrow: '1', borderStyle: 'groove'}} className="L">
          <div style={{height: '30px' , fontWeight: 'bold', borderStyle: 'solid'}}>Products that has been ranked top 10 in the past</div>
          <div style={{height: '400px', overflow: 'auto'}} className="scroll">
            {returnText()}
          </div>
      </div>
    );
}

export default L;