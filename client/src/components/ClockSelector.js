import React from "react";
import TimeKeeper from 'react-timekeeper';
import "../css/clock-selector.css";

class ClockSelector extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            time: '6:50 am',
            displayTimepicker: true
        }
        this.handleTimeChange = this.handleTimeChange.bind(this)
    }
    handleTimeChange(newTime){
        this.setState({ time: newTime.formatted})
    }
    toggleTimekeeper(val){
        this.setState({displayTimepicker: val})
    }
    render(){
        return (
            <div className="center">
                {this.state.displayTimepicker ?
                    <TimeKeeper 

                        time={this.state.time}
                        onChange={this.handleTimeChange}
                        onDoneClick={() => {
                            this.toggleTimekeeper(false)
                        }}
                        switchToMinuteOnHourSelect={true}
                        config={{
                            useCoarseMinutes: false
                        }}
                    />
                    :
                    false
                }
                <span>Time is {this.state.time}</span>
                <button onClick={() => this.toggleTimekeeper(true)}>OPEN</button>
            </div>
        )
    }
} 
export default ClockSelector;