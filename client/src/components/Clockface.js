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
        //points dict- [time]=info
        this.state = {
            points: {},
            chosenDate: new Date(),
        }
    }

    getDayEvents = (userID, chosenDate) =>{
        //gets all the data points for one day
        //convert the day, put in ref - only one day pt
        let monthMap = {0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun", 6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"}
        let year = chosenDate.getYear() + 1900
        let month = chosenDate.getMonth()
        let date = chosenDate.getDate()
        if(date < 10){
            date = "0"+String(date)
        }else{
            date = String(date)
        }
        let reformatDate = monthMap[month] + "_" + date + "_" + year
        console.log(reformatDate);
        let refDates = firebase.database().ref("users/4afb720a-5214-4337-841b-d5f954214877/user_data/" + reformatDate);
        //resets when called again- shut off listeners, empty state
        refDates.off()
    	this.setState({
    		chosenDate: chosenDate,
    		points: {},
    	});
        //gets each time from date path
        refDates.orderByKey().on("child_added", (snapshot) => {
            let pointTime = snapshot.key
            if(pointTime != "day_info"){
                let temp = this.state.points
                temp[pointTime] = snapshot.val()//stored by time
                //add day and time to easily access
                temp[pointTime]['date'] = reformatDate
                temp[pointTime]['time'] = pointTime
                this.setState({
                    points: temp
                })
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

    makeRegions = (changepts) =>{
        //returns list of arc paths to draw
        let goal = []
        if(changepts[0] != undefined){
            //asuming we have a list of activity changes: changepts
            function getCoordinatesForPercent(percent) {
                const x = Math.cos(2 * Math.PI * percent)*99;
                const y = Math.sin(2 * Math.PI * percent)*99;
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
                let pathInfo = 'M '+ start[0] +' '+start[1]+' A 99 99 0 '+largeArcFlag+' 1 '+end[0]+' '+end[1]
                goal.push(<path key={changepts[i].time} style={{stroke: this.getColor(changepts[i].current_activity)}} d={pathInfo}></path>)
                start = getCoordinatesForPercent(percent)
            }
            //do the last segment
            let end = getCoordinatesForPercent(1)
            let largeArcFlag = (1-lastp) > .5 ? 1 : 0;
            let pathInfo = 'M '+ start[0] +' '+start[1]+' A 99 99 0 '+largeArcFlag+' 1 '+end[0]+' '+end[1]
            goal.push(<path key={changepts[changepts.length-1].time} style={{stroke: this.getColor(changepts[changepts.length-1].current_activity)}} d={pathInfo}></path>)
        }
        return goal
    }

    getPercent = (time) =>{
        //time comes in as 01:55am
        let hour = Number(time.slice(0,2))//would return 1
        let min = Number(time.slice(3,5))//would return 55
        return (hour%12 + min/60)/12
        //returns percent of circle
    }

    getColor = (activity) => {
        let activityColor = {' On_Foot ':'darkorchid', ' Work ':'orange', ' Meeting ':'darkblue'}
        if(activity in activityColor){
            return activityColor[activity]
        } else{
            return 'black'
        }
    }

    compfunc = (a,b) =>{
        return this.getPercent(a.time)-this.getPercent(b.time)
    }

    getChangePts = () => {
        //LATER - may be able to clean this code if the database call returns the points in chron order
        let ampm = []
        Object.keys(this.state.points).map(key => {
            //if the point is in the ampm,,, key is the time?
            if((String(key.slice(5)) == "am") == this.props.am){
                ampm.push(this.state.points[key])
            }
        })
        let changes = []
        //need to be able to check the next pt, so make it a list
        ampm.sort(this.compfunc)
        for(let i = 0; i < ampm.length-1; i++){
            if(ampm[i].current_activity != ampm[i+1].current_activity){
                changes.push(ampm[i])
            }
        }
        changes.push(ampm[ampm.length-1])//add the last pt so we know what the activity is
        return changes
    }

    componentDidMount(){
        this.getDayEvents(this.props.user.uid, this.state.chosenDate)
    }

    datePicked = (date) => {
        this.getDayEvents(this.props.user.uid, date)
    }

    render () { 
        console.log("state.points ", this.state.points)
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
                        viewBox="-100 -100 200 200"
                        style={{transform: 'rotate(-0.25turn)', 
                            opacity: '.4', 
                            position: 'absolute', 
                            left: '0', top: '0',
                            strokeWidth: '2px',
                            fill: 'transparent'}}>
                        {Object.keys(paths).map(path => {
                            return paths[path]
                        })}
                    </svg>
                    {Object.keys(this.state.points).map(pointKey => {
                        let point = this.state.points[pointKey];
                        //this.props.am is true if am, but time holds a string, need to convert
                        if((String(pointKey.slice(5)) == "am") == this.props.am){
                            return (<EventDot
                                key={String(point.date)+String(pointKey)}
                                date={point.date}
                                time={pointKey}
                                activity={point.current_activity}
                                //name={point.name}
                                relationship={point.relationship}
                                location={point.loc_name}
                                passTime={this.props.passTime}
                                goToUpdate={this.props.goToUpdate}
                                user={this.props.user}
                            />)
                        }
                    })}
                </div>
            </div>
        );
    }
};