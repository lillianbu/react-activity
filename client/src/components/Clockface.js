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
            points: []
          }
    }
//pass in a func that will update state? bc rn it doesnt render...
    getDayEvents = (userID, thiscomp, func) =>{
        //pull in times from the day
        let refDates = firebase.database().ref("users/"+ userID);
        //child_added gets each point one by one
        //let points = []
        refDates.on("child_added", function(snapshot) {//may need to .orderByChild("date") , maybe .limitToFirst(30)
            let point = snapshot.val() 

            console.log("snapshot: ", point);
            if (point.date == "2019 11 Dec"){
                console.log("make point")
                //points.push(point)
                func(point, thiscomp)
            }
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        });
    }

    componentDidMount(){
        //tried to make it work kinda like catbook with react
        this.getDayEvents(this.props.user.uid, this, function(point, thiscomp){
            thiscomp.setState({
                points: (thiscomp.state.points).concat(point)
            })
        })
    }
        
    render () { 
        return (
            <div id="clockface" className = "clockface">
                <Clock className='normal clock-svg' />
                {//trying to put the info in the state so it will refresh-doesnt work
                this.state.points.map(point => {
                    <EventDot
                        key={point.date+point.time}
                        time={point.time}
                    />
                })}
                {//OLD WORKING CODE
                Array.from(Array(12).keys()).map( x =>//generates 1-12 time
                    <EventDot 
                        key={String(x)}//needs for uniqueness(must), and for now id for element
                        time={String(x+1)+":00"}
                        am={this.props.am}
                        passTime={this.props.passTime}
                        goToUpdate={this.props.goToUpdate}
                        user={this.props.user}
                    />
                )}
            </div>
        );
    }
};
//FAILED ATTEMPTS
    // {Array.from(Array(12).keys()).map( x =>//generates 1-12 time
    //     <EventDot 
    //         key={String(x)}//needs for uniqueness(must)
    //         time={String(x+1)+":00"}
    //         am={this.props.am}
    //         passTime={this.props.passTime}
    //     />
    // )}
    /* {this.getDayEvents(this.props.userID).map((value, index) => {
            console.log("adding pt ", value);
            <EventDot 
                key={index}//needs for uniqueness(must)
                time={value.time}
                passTime={this.props.passTime}
            />
        })}
        {this.getDayEvents(this.props.userID).map(function(info, index){
            return <EventDot 
                key={index}//needs for uniqueness(must)
                time={info.time}
                passTime={this.props.passTime}
            />;
        })} 
        { {this.state.points.map(function(info, index){
            console.log("in for loop")
            return <EventDot 
                key={index}//needs for uniqueness(must)
                time={info.time}
                passTime={this.props.passTime}
            />;
        })} }
        { {this.getDayEvents(this.props.userID).then((value)=>{
            console.log("in then")
            value.map(function(info, index){
                console.log("in for loop")
                return <EventDot 
                    key={index}//needs for uniqueness(must)
                    time={info.time}
                    passTime={this.props.passTime}
                />;
            })
        })}
        {this.state.points.map(function(info, index){
                    console.log("in for loop")
                    return <EventDot 
                        key={index}//needs for uniqueness(must)
                        time={info.time}
                        passTime={this.props.passTime}
                    />;
                })} */
    //return <EventDot key={point.date+point.time} time={point.time} passTime={passtime}/>
    // {this.getDayEvents(this.props.userID, function(point, document){
    //     console.log("new function ", point)
    //     let dot = <EventDot key={point.date+point.time} time={point.time}/>
    //     ReactDOM.render(dot, document.getElementById("clockface"))
    // },document)}