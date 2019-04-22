import React from "react";

class ActivityBand extends React.Component {

  makeRegions = (changepts) =>{
    //returns list of arc paths to draw
    let goal = []
    if(changepts[0] != undefined){
      //asuming we have a list of activity changes: changepts
      
      //start at the very top
      let start = this.getCoordinatesForPercent(0)
      let lastp = 0
      //last pt only there so we know what the activity is at that time, skip it
      for(let i = 0; i < changepts.length-1; i++){
        let percent = this.getPercent(changepts[i].time)
        let end = this.getCoordinatesForPercent(percent)
        let largeArcFlag = (percent-lastp) > .5 ? 1 : 0;
        lastp = percent
        let pathInfo = 'M '+ start[0] +' '+start[1]+' A 99 99 0 '+largeArcFlag+' 1 '+end[0]+' '+end[1]
        goal.push(<path key={changepts[i].time} style={{stroke: this.getColor(changepts[i].current_activity)}} d={pathInfo}></path>)
        start = this.getCoordinatesForPercent(percent)
      }
      //do the last segment
      let end = this.getCoordinatesForPercent(1)
      let largeArcFlag = (1-lastp) > .5 ? 1 : 0;
      let pathInfo = 'M '+ start[0] +' '+start[1]+' A 99 99 0 '+largeArcFlag+' 1 '+end[0]+' '+end[1]
      goal.push(<path key={changepts[changepts.length-1].time} style={{stroke: this.getColor(changepts[changepts.length-1].current_activity)}} d={pathInfo}></path>)
    }
    return goal
  }

  getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent)*99;
    const y = Math.sin(2 * Math.PI * percent)*99;
    return [x, y];
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

  render() {
    let paths = this.makeRegions(this.props.points)
    return (
        <svg viewBox="-100 -100 200 200" style={{transform: 'rotate(-0.25turn)', 
              opacity: '.4', 
              position: 'absolute', 
              left: '0', top: '0',
              strokeWidth: '2px',
              fill: 'transparent'}}>
          {Object.keys(paths).map(path => {
            return paths[path]
          })}
      </svg>
    );
  }
}

export default ActivityBand;