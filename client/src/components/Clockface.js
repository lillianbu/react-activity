import React from 'react'
import "../css/app.css";
import Clock from 'svg-react-loader?name=Clockface!../css/clockface.svg';
import EventDot from "./EventDot";

export default class Clockface extends React.Component {
    constructor(props){
        super(props);
    }

    render () {
        //Array line creates an empty length 12 array, then makes an array using those keys
        return (
            <div className = "clockface">
                <Clock className='normal clock-svg' />
                {Array.from(Array(12).keys()).map( x =>//generates 1-12 time
                    <EventDot 
                        key={String(x)}//needs for uniqueness(must), and for now id for element
                        time={String(x+1)+":00"}
                        am={this.props.am}
                        passTime={this.props.passTime}
                    />
                )}
            </div>
        );
    }
};