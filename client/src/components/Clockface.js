import React from 'react'
import "../css/app.css";
import Clock from 'svg-react-loader?name=Clockface!../css/clockface.svg';
import EventDot from "./EventDot";
import firebase from '../../../firebase';

export default class Clockface extends React.Component {
    constructor(props){
        super(props);
        //make a state so it will re render when points are added
        this.state = {
            points: [],
            gotData: false
          }
    }
//pass in a func that will update state? bc rn it doesnt render...
    getDayEvents = (userID) =>{
        //pull in times from the day
        let refDates = firebase.database().ref("users/"+ userID);
        //child_added gets each point one by one
        refDates.on("child_added", (snapshot) => {//may need to .orderByChild("date") , maybe .limitToFirst(30)
            let point = snapshot.val() 

            console.log("snapshot: ", point);
            if (point.date == "2019 11 Dec"){
                console.log("make point")
                let temp = this.state.points
                temp.push(point)
                this.setState({
                    points: temp
                })
            }
            console.log("points: ", this.state.points)
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        });
    }

    componentDidMount(){
        this.getDayEvents(this.props.user.uid)
    }
        
    render () { 
        console.log("render")
        return (
            <div id="clockface" className = "clockface">
                <Clock className='normal clock-svg' />
                {//trying to put the info in the state so it will refresh-doesnt work
                this.state.points.map(point => {
                    console.log("dots rendering");
                    <EventDot
                        key={"point.date+point.time"}
                        time={"11:30"}
                        passTime={this.props.passTime}
                    />
                })}
                {/* {//OLD WORKING CODE
                Array.from(Array(12).keys()).map( x =>//generates 1-12 time
                    <EventDot 
                        key={String(x)}//needs for uniqueness(must), and for now id for element
                        time={String(x+1)+":00"}
                        am={this.props.am}
                        passTime={this.props.passTime}
                        goToUpdate={this.props.goToUpdate}
                        user={this.props.user}
                    />
                )} */}
            </div>
        );
    }
};