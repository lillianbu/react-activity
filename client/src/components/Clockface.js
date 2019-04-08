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

    getPercent = (time) =>{
        //time comes in as 11:00 am
        let times1 = time.split(':')//would return list of 11, 00 am
        let times2 = times1[1].split(" ")//returns list 00, am
        let first = Number(times1[0])%12
        let second = Number(times2[0])/60
        return (first+second)/12
        //returns percent of circle
    }

    makeRegions = (changepts) =>{
        //returns list of arc paths to draw
        let activityColor = {'work':'#cc3232', 'play':'orange', 'sleep':'darkblue'}
        let goal = []
        if(changepts[0] != undefined){
            //asuming we have a list of activity changes: changepts
            function getCoordinatesForPercent(percent) {
                const x = Math.cos(2 * Math.PI * percent);
                const y = Math.sin(2 * Math.PI * percent);
                return [x, y];
            }
            //start at the very top
            let start = getCoordinatesForPercent(0)
            let lastp = 0
            //last pt only there so we know what the activity is at that time, skip it
            for(let i = 0; i < changepts.length-1; i++){
                let percent = this.getPercent(changepts[i].time)
                let end = getCoordinatesForPercent(percent)
                let largeArcFlag = (percent-lastp) > .5 ? 1 : 0;
                lastp = percent
                let pathInfo = 'M '+ start[0] +' '+start[1]+' A 1 1 0 '+largeArcFlag+' 1 '+end[0]+' '+end[1]+' L 0 0'
                goal.push(<path style={{fill: activityColor[changepts[i].activity]}} d={pathInfo}></path>)
                start = getCoordinatesForPercent(percent)
            }
            //do the last segment
            let end = getCoordinatesForPercent(1)
            let largeArcFlag = (1-lastp) > .5 ? 1 : 0;
            let pathInfo = 'M '+ start[0] +' '+start[1]+' A 1 1 0 '+largeArcFlag+' 1 '+end[0]+' '+end[1]+' L 0 0'
            goal.push(<path style={{fill: activityColor[changepts[changepts.length-1].activity]}} d={pathInfo}></path>)
        }
        return goal
    }

    compfunc = (a,b) =>{
        return this.getPercent(a.time)-this.getPercent(b.time)
    }

    getChangePts = () => {
        let ampm = []
        Object.keys(this.state.points).map(key => {
            //if the point is in the ampm
            if((String(this.state.points[key].time.split(" ")[1]) == "am") == this.props.am){
                console.log("adding to am ", this.state.points[key])
                ampm.push(this.state.points[key])
            }
        })
        let changes = []
        //need to be able to check the next pt, so make it a list
        ampm.sort(this.compfunc)
        for(let i = 0; i < ampm.length-1; i++){
            if(ampm[i].activity != ampm[i+1].activity){
                console.log('add to change ', ampm[i])
                changes.push(ampm[i])
            }
        }
        changes.push(ampm[ampm.length-1])//add the last pt so we know what the activity is
        console.log('changes pts ', changes)
        return changes
    }

    componentDidMount(){
        this.getDayEvents(this.props.user.uid, this.state.chosenDate)
    }

    datePicked = (date) => {
        this.getDayEvents(this.props.user.uid, date)
    }

    render () { 
        console.log(this.props.user.uid)
        //makes list of paths to render
        let paths = this.makeRegions(this.getChangePts())
        return (
            <div id="clockface" className = "clockface">
            	<DatePicker 
            	    dateFormat="yyyy/dd/MM"
            		selected={this.state.chosenDate}
            		onChange={this.datePicked}
                />
                <div className='clockholder'>
                    <Clock className='clock-svg' />
                    <svg
                        viewBox="-1 -1 2 2"
                        style={{transform: 'rotate(-0.25turn)', opacity: '.3', position: 'absolute', left: '0', top: '0'}}>
                        {Object.keys(paths).map(path => {
                            return paths[path]
                        })}
                    </svg>
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