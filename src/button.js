import React, { Component } from "react";


const Button = (props) => {

    const change = () => {
        props.handler('world')
    }

    return (
        <button style={{ width: '100px', height: '100px'}} onClick={change}>Click me to show data for all countries</button>
    );
}

export default Button;