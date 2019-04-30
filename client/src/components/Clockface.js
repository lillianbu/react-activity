import React from 'react'
import "../css/app.css";
import Clock from 'svg-react-loader?name=Clockface!../css/clockface.svg';
import EventDot from "./EventDot";
import firebase from '../../../firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ActivityBand from './ActivityBand';
import HeartRing from './HeartRing';
import { PassThrough } from 'stream';

export default class Clockface extends React.Component {
    constructor(props){
        super(props);
        //points dict- [time]=info
        this.state = {
            chosenDate: new Date(),
            points: {},
            keylis: []//list of keys-so can index
        }
    }

    reformatDate = (chosenDate) =>{
        let monthMap = {0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun", 6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"}
        let year = chosenDate.getYear() + 1900
        let month = chosenDate.getMonth()
        let date = chosenDate.getDate()
        if(date < 10){
            date = "0"+String(date)
        }else{
            date = String(date)
        }
        return monthMap[month] + "_" + date + "_" + year
    }

    getDayEvents = (userID, chosenDate) =>{
        //gets all the data points for one day
        //convert the day, put in ref - only one day pt
        let reformatDate = this.reformatDate(chosenDate)
        let refDates = firebase.database().ref("users/4afb720a-5214-4337-841b-d5f954214877/user_data/" + reformatDate);
        //resets when called again- shut off listeners, empty state
        refDates.off()
    	this.setState({
    		chosenDate: chosenDate,
            points: {},
            keylis: []
    	});
        //gets each time from date path
        let temp = {}
        let keytemp = []
        refDates.orderByKey().on("child_added", (snapshot) => {
            let pointTime = snapshot.key
            if(pointTime != "day_info"){//catches the one pt that isnt a time
                temp[pointTime] = snapshot.val()//stored by time
                temp[pointTime]['date'] = reformatDate
                temp[pointTime]['time'] = pointTime
                keytemp.push(pointTime)
            }else{
                //this is the last point
                this.setState({
                    points: temp,
                    keylis: keytemp
                })
                this.order12()
            }
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        });

        //when point changes
        refDates.on("child_changed", (snapshot) => {
            //overwrite the old value
            let ptkey = snapshot.key
            let temp = this.state.points
            temp[ptkey] = snapshot.val()
            //dont need to update keylis, still there
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
            //delete time from keylis
            let i = this.state.keylis.indexOf(ptkey)
            let keytemp = this.state.keylis
            keytemp.splice(i,1)
            this.setState({
                points: temp,
                keylis: keytemp
            })
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        });
    }

    order12 = () =>{
        //put twelves at front of keylis
        let index = 0
        for(let i = 0; i < this.state.keylis.length; i++){
            let start = this.state.keylis[i].slice(0,2)
            if(start == '12'){
                index = i
                break
            }
        }
        let twelves = this.state.keylis.splice(index, this.state.keylis.length)
        let start = this.state.keylis.splice(0, index)
        let keys = twelves.concat(start)//list where 12 is before 1
        this.setState({
            keylis: keys
        })
    }

    getTime = (time) =>{
        //time comes in as 01:23pm
        let hour = Number(time.slice(0,2))//would return 20
        let min = Number(time.slice(3,5))//would return 3
        return (hour%12 + min/60)
        //returns time, in hrs- ex 8.05
    }

    displayPoints = (changepts) =>{
        // returns a list of keys that should be displayed
        // between each change pt, show after 7 min
        let ampm = this.amOrPm(this.props.am)
        if(ampm.length == 0){
            return []
        }
        let display = [ampm[0]]
        let i = 0
        let j = 1//so we can keep track from a pt to the next
        while(i+j < ampm.length-1){
            let diff = this.getTime(ampm[i+j]) - this.getTime(ampm[i])
            if(changepts.includes(ampm[i+j]) || diff >= 7/60){
                display.push(ampm[i+j])
                i+=j
                j = 1
            }
            j++
        }  
        return display//list of keys  
    }

    getChangePts = () => {
        let ampm = this.amOrPm(this.props.am)//only am or pm
        if(ampm.length == 0){//to catch no data errors
            return []
        }
        let changes = []
        //check if there is a change, need only am/pm to properly get next pt
        for(let i = 0; i < ampm.length-1; i++){
            let key = ampm[i]
            if(this.state.points[key].current_activity != this.state.points[ampm[i+1]].current_activity){
                changes.push(this.state.points[key])
            }
        }
        changes.push(this.state.points[ampm[ampm.length-1]])//add the last pt so we know what the activity is
        return changes//list of pts
    }

    amOrPm = (am) =>{
        //gets only am or pm pts of this.state.keylis
        let ampm = []
        for(let i = 0; i < this.state.keylis.length; i++){
            if(this.state.keylis[i].slice(5) == am){
                ampm.push(this.state.keylis[i])
            }
        }
        return ampm
    }

    datePicked = (date) => {
        this.getDayEvents(this.props.user.uid, date)
    }

    componentDidMount(){
        this.getDayEvents(this.props.user.uid, this.state.chosenDate)
    }

    render () { 
        return (
            <div id="clockface" className = "clockface">
                <div>Select a Day:</div>
            	<DatePicker 
            	    dateFormat="yyyy/dd/MM"
            		selected={this.state.chosenDate}
            		onChange={this.datePicked}
                />
                <div className='clockholder'>
                    <Clock className='clock-svg' />
                    <ActivityBand points={this.getChangePts(this.props.am)}/>
                    <HeartRing date={this.state.chosenDate} am={this.props.am} uid={this.props.user.uid}/>
                    {this.state.points[this.state.keylis[0]] != undefined ? 
                        this.displayPoints(this.getChangePts()).map(i => {
                            let point = this.state.points[i];
                            return (<EventDot
                                key={String(point.date)+String(i)}
                                date={point.date}
                                time={i}
                                activity={point.current_activity}
                                //name={point.name}
                                relationship={point.relationship}
                                location={point.loc_name}
                                //passTime={this.props.passTime}
                                goToUpdate={this.props.goToUpdate}
                                user={this.props.user}
                            />)
                            }
                    ):console.log("no data")
                    }
                </div>
            </div>
        );
    }
};