import React from 'react'
import "../css/app.css";
import Clock from 'svg-react-loader?name=Clockface!../css/clockface.svg';
import EventDot from "./EventDot";
import firebase from '../../../firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class Clockface extends React.Component {
    constructor(props){
        super(props);
        //points hold the time points for one day
        this.state = {
            points: {},
            chosenDate: new Date(),
          }
    }


    getDayEvents = (userID, chosenDate) =>{
        let refDates = firebase.database().ref("users/"+ userID);
        //resets when called again- shut off listeners, empty state
        refDates.off()
    	this.setState({
    		chosenDate: chosenDate,
    		points: {},
    	});
        //pull in times from the day
        let monthMap = {0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun", 6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"}
        let year = chosenDate.getYear() + 1900
        let month = chosenDate.getMonth()
        let date = chosenDate.getDate()
        let reformatDate = year + " " + date + " " + monthMap[month]
        console.log(reformatDate);
        //gets each pt at the specified date, updates if added
        refDates.orderByChild("date").equalTo(reformatDate).on("child_added", (snapshot) => {
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
        this.getDayEvents(this.props.user.uid, this.state.chosenDate)
    }

    datePicked = (date) => {
        this.getDayEvents(this.props.user.uid, date)
    }

    render () { 
        return (
            <div id="clockface" className = "clockface">
            	<DatePicker 
            	    dateFormat="yyyy/dd/MM"
            		selected={this.state.chosenDate}
            		onChange={this.datePicked}
                />
                <div className='clockholder'>
                    <Clock className='clock-svg' />
                    {Object.keys(this.state.points).map(pointKey => {
                        let point = this.state.points[pointKey];
                        //this.props.am is true if am, but time holds a string, need to convert
                        if((String(point.time.split(" ")[1]) == "am") == this.props.am){
                            return (<EventDot
                                key={String(point.date+point.time)}
                                pointName={pointKey}
                                date={point.date}
                                time={point.time}
                                passTime={this.props.passTime}
                                goToUpdate={this.props.goToUpdate}
                                user={this.props.user}
                                activity={point.activity}
                                name={point.name}
                                relationship={point.relationship}
                                location={point.location}
                            />)
                        }
                    })}
                </div>
            </div>
        );
    }
};