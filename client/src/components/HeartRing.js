import React from "react";
import firebase from '../../../firebase';

class HeartRing extends React.Component {
    constructor(props){
        super(props);
        //data stored as list of lists with [0]='time', [1]=value(int)
        this.state = {
            amarcs: [],
            pmarcs: [],
            oldDay: ''
        }
    }

    makeSections = (data, min, max) =>{
        //init colors
        let step = (max-min)/7
        let colors = ['#ff9999','#ff8080','#ff6666', '#ff4d4d','#ff1a1a', '#e60000', '#cc0000']//7colors

        let arcsam = []
        let arcspm = []
        for(let i = 0; i < data.length; i += 1){

            //make small arc piece
            let time = this.getTime(data[i][0])
            let start = this.getCoordinatesForTime(time)
            let end = this.getCoordinatesForTime(time+5/60)//make it 5 min(bc its 5 min of data)
            //if its the last pt
            if(i+1 >= data.length){
                //close to the end, just finish
                if(time >= 11.8){
                    end = this.getCoordinatesForTime(12)
                }
            }//the next pt is within 8 min away end it there
            else if(time+(8/60) > this.getTime(data[i+1][0])){
                end = this.getCoordinatesForTime(this.getTime(data[i+1][0]))
            }
            //make svg element
            let pathInfo = 'M '+ start[0] + ' '+start[1]+' A 60 60 0 0 1 '+ end[0] +' '+ end[1]//will always be small arc
            let color = 'transparent'
            for(let j = 0; j<7; j+=1){
                if(data[i][1] >= (min + step*(j))){
                    color = colors[j]
                }
            }
            if(this.get24Time(data[i][0]) < 12){//if am
                arcsam.push(<path key={i} style={{stroke: color}} d={pathInfo}></path>)
            }else{
                arcspm.push(<path key={i} style={{stroke: color}} d={pathInfo}></path>)
            }
        }
        this.setState({
            amarcs: arcsam,
            pmarcs: arcspm
        })
    }

    getCoordinatesForTime = (time) => {
        const x = Math.cos(2 * Math.PI * time/12)*60;
        const y = Math.sin(2 * Math.PI * time/12)*60;
        return [x, y];
    }
      
    getTime = (time) =>{
        //time comes in as 2019_04_11_20_03_23
        let hour = Number(time.slice(11,13))//would return 20
        let min = Number(time.slice(14,16))//would return 3
        return (hour%12 + min/60)
        //returns time, in hrs- ex 8.05
    }

    get24Time = (time) =>{
        //time comes in as 2019_04_11_20_03_23
        let hour = Number(time.slice(11,13))//would return 20
        let min = Number(time.slice(14,16))//would return 3
        return (hour + min/60)
        //returns time, in hr- ex 8.05
    }

    getHeartData = (date, userID) =>{
        let storage = firebase.storage(); 
        let refurl = 'gs://activity2019-f8035.appspot.com/users/4afb720a-5214-4337-841b-d5f954214877/Heart_Rate/bpm_new.csv';
        let gsRef = storage.refFromURL(refurl); 
        gsRef.getDownloadURL().then((url) => {
            //downloads the csv into blob
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                let blob = xhr.response;
                console.log("blob ", blob)
                window.myblob = blob
                let reader = new FileReader();
                reader.addEventListener('loadend', () => {
                    let uarr = new Uint8Array(reader.result)
                    let end = Math.floor(uarr.length/100000) + 1

                    //too big to process all at once, divide into 100,000 nums at once
                    let dataStr = ''
                    for(let i = 0; i < end; i+=1){
                        let arr = new Array(...uarr.slice(i*100000,(i+1)*100000)).map((x)=>String.fromCharCode(x)).join('')
                        dataStr = dataStr.concat(arr)
                    }
                    let dataPts = dataStr.split(/\n/)

                    //holds all the data(per second)
                    let seen = false
                    let dataDay = []
                    //gather all for 1 day
                    for(let j = 0; j < dataPts.length; j +=1){
                        let data = dataPts[j].split(',')
                        let value = parseFloat(data[1])
                        //first part of string is date, second is time
                        if(data[0].slice(0,10) == date){
                            seen = true
                            if(value != 0){
                                dataDay.push([data[0], value])
                            }
                        } else if (seen){//break if seen the date already (its in chron order)
                            break
                        }
                    }  

                    if(dataDay.length == 0){
                        return//there is no data for that day
                    }

                    //get the average for a minute, and max and min
                    let dataMinutes = []
                    let minuteMax = this.get24Time(dataDay[0][0]) + 5/60//for every 5 min
                    let sum = 0//value sum
                    let total = 0//num of data pts
                    let k = 0//index for data
                    let min = 500
                    let max = 0
                    while(k < dataDay.length){
                        //same min- add to total, count
                        let time = this.get24Time(dataDay[k][0])
                        if(time < minuteMax){
                            total += 1
                            sum = sum + dataDay[k][1]//floats
                        }else{
                            let av = sum/total
                            dataMinutes.push([dataDay[k-1][0].slice(0,16), av])//stores [date_time, avheartrate]
                            //reset for new minute
                            minuteMax = time+5/60
                            sum = dataDay[k][1]
                            total = 1
                            if(av >= max){
                                max = av
                            } if(av <= min){//both ifs to catch first value
                                min = av
                            }
                        }
                        k += 1
                    }
                    this.makeSections(dataMinutes, min, max)
                });
                reader.readAsArrayBuffer(blob);
            };
            xhr.open('GET', url);
            xhr.send();
        }); 
    }

    reformatDate = (chosenDate) =>{
        console.log(chosenDate)
        if(chosenDate == undefined){
            return undefined
        }
        let year = chosenDate.getYear() + 1900
        let month = chosenDate.getMonth()+1
        if(month < 10){
            month = "0"+String(month)
        }else{
            month = String(month)
        }
        let date = chosenDate.getDate()
        if(date < 10){
            date = "0"+String(date)
        }else{
            date = String(date)
        }
        return year + "_" + month + "_" + date
    }

    componentDidUpdate(){//run after it re-renders when the date changes
        console.log("did update")
        let day = this.reformatDate(this.props.date)
        console.log("date now ", day)
        console.log("date old ", this.state.oldDay)

        if(day != this.state.oldDay){
            console.log("dates not equal")
            this.getHeartData(day, this.props.uid)
            this.setState({
                oldDay: day
            })
        }
    }

    componentDidMount(){//run once in beginning
        //set day when first made so we know if the day changes later
        console.log("did mount")
        let day = this.reformatDate(this.props.date)
        this.setState({
            oldDay: day
        })
        this.getHeartData(day, this.props.uid)//get data
    }

    render() {
        return (
            <svg viewBox="-100 -100 200 200" style={{transform: 'rotate(-0.25turn)',  
                    position: 'absolute', 
                    left: '0', top: '0',
                    strokeWidth: '8px',
                    fill: 'transparent'}}>
                {this.props.am == 'am' ?//if am, use am arcs
                    Object.keys(this.state.amarcs).map(arc => {
                    return this.state.amarcs[arc]
                }):
                    Object.keys(this.state.pmarcs).map(arc => {
                    return this.state.pmarcs[arc]
                })}
            </svg>
        );
    }
}

export default HeartRing;