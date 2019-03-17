import React from 'react'
import "../css/app.css";
import Clock from 'svg-react-loader?name=Clockface!../css/clockface.svg';
import EventDot from "./EventDot";
import firebase from '../../../firebase';

export default class Clockface extends React.Component {
    constructor(props){
        super(props);
        //points hold the time points for one day
        this.state = {
            points: {},
          }
    }

    getDayEvents = (userID) =>{
        //pull in times from the day
        let refDates = firebase.database().ref("users/"+ userID);

        //gets each pt, ordered by date, starting at the date to the end of the date
        refDates.orderByChild("date").equalTo("2019 11 Dec").on("child_added", (snapshot) => {
            let ptkey = snapshot.key
            let temp = this.state.points
            temp[ptkey] = snapshot.val()
            this.setState({
                points: temp
            })
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        });

        //when point changes
        refDates.on("child_changed", (snapshot) => {
            //overwrite the old value
            let ptkey = snapshot.key
            let temp = this.state.points
            temp[ptkey] = snapshot.val()
            this.setState({
                points: temp
            })
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        });

        //deletes point
        refDates.on("child_removed", (snapshot) => {
            //remove from state- will remove from screen
            let ptkey = snapshot.key
            let temp = this.state.points
            delete temp[ptkey]
            this.setState({
                points: temp
            })
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        });
    }

    componentDidMount(){
        this.getDayEvents(this.props.user.uid)
    }
        
    render () { 
        return (
            <div id="clockface" className = "clockface">
                <Clock className='normal clock-svg' />
                {Object.values(this.state.points).map(point => {
                    //this.props.am is true if am, but time holds a string, need to convert
                    if((String(point.time.split(" ")[1]) == "am") == this.props.am){
                        return (<EventDot
                            key={String(point.date+point.time)}
                            date={point.date}
                            time={point.time}
                            passTime={this.props.passTime}
                            goToUpdate={this.props.goToUpdate}
                            user={this.props.user}
                        />)
                    }
                })}
            </div>
        );
    }
};