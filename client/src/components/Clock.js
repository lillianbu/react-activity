import React from "react";
import "../css/app.css";
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch"

class Clock extends React.Component {
  constructor(props) {
    console.log("in constructor")
    super(props);
  }
  render() {
    // const hoursDegrees = this.state.date.getHours() * 30 + this.state.date.getMinutes() /2;
    // const minutesDegrees = this.state.date.getMinutes() * 6 + this.state.date.getSeconds() /10;
    // const secondsDegrees = this.state.date.getSeconds() * 6;
    
    // const divStyleHours = {
    //   transform: "rotateZ(" + hoursDegrees + "deg)"
    // };

    // const divStyleMinutes = {
    //   transform: "rotateZ(" + minutesDegrees + "deg)"
    // };
    
    // const divStyleSeconds = {
    //   transform: "rotateZ(" + secondsDegrees + "deg)"
    // };

    return (
      <div>
        <div id="clock-circle"> </div>
        
      </div>     
    );
  }
}

export default Clock;