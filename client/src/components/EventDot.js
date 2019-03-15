import React from "react";
import "../css/app.css";
import { callbackify } from "util";
import { pipeline } from "stream";

class EventDot extends React.Component {
    constructor(props){
        super(props)
    }
    //a point has: date, time, activity, location, obj detected, faces, day, type of day
    //for a dot need time, activity, location?
    getPos = () =>{
        //take time to get theta, scale to get r
        let theta = (this.getTime())/12*2*3.141593
        //angle from the vertical axis, need to shift x=sin y=-cos(inverted y axis)
        let x = String(Math.sin(theta))
        let y = -Math.cos(theta)
        let yadjust = String(y) + " - "+ String(1.92*y) + "px"//1.92 from 4px added to height(?) times .45
        //offset for dot size, origin at center, 45% radius (concat is just fancy adding)
        return {top: 'calc(50% - 7px + 48% * '.concat(yadjust), left: 'calc(50% - 7px + 48% * '.concat(x)}
    }

    displayTime = () =>{
        let time = this.props.time.split(" ")
        //this.props.passTime(time[0])//callback from Home to pass time up when clicked
        console.log(this.props.time)
        //shows tooltip
        let tooltip = document.getElementById(this.props.time)
        tooltip.style.visibility = "visible";
    }

    getTime = () =>{
        //time comes in as 11:00 am
        let times1 = this.props.time.split(':')//would return list of 11, 00 am
        let times2 = times1[1].split(" ")//returns list 00, am
        let first = Number(times1[0])%12
        let second = Number(times2[0])/60
        return first+second
    }

    closeTooltip = () =>{
        let tooltip = document.getElementById(this.props.time)
        tooltip.style.visibility = "hidden";
    }

    render() {
        //time is id for now, later make into imageName, and then make a parser to get time, etc from that
        let side = {left: '20px'}
        if (this.getTime() > 6){
            side = {right: '5px'}
        }
        return (
            <div className="top" style={this.getPos()}>
                <span className="dot top" onClick={this.displayTime}></span>
                <span className="tooltip">
                    <div id={this.props.time} className="tooltiptext" style={side}>
                        from: {this.props.time}
                        <br/>Activity, Location
                        <div className="xbutton" onClick={this.closeTooltip}>&times;</div>
                    </div>
                </span>
            </div>
        )
    }
}

export default EventDot;