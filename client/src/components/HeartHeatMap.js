import React from "react";
import firebase from '../../../firebase';
import * as d3 from "d3";

class HeartHeatMap extends React.Component {
    constructor(props){
        super(props);
        //data stored as list of lists with [0]='time', [1]=value(int) (av of every 5 min)
        this.state = {
            data: [],
            colorScale: [],
            // amarcs: [],
            // pmarcs: [],
            oldDay: ''
        }
    }

    makeSections = (data, min, max) =>{
        console.log(data);
        let colorDomain = d3.extent(data, (d) => {
          return d.heart_rate;
        });

        console.log(colorDomain);


        let colorScale = d3.scaleLinear()
          .domain(colorDomain)
          .range(["#ff9999","#cc0000"]);
        console.log(colorScale);

        // var svg = d3.select(".heart-heat-map")
        let svg = d3.select("body")
          .append("svg")
          .attr("width", 700)
          .attr("height", 500);

        let rectangles = svg.selectAll("rect")
          .data(data)
          .enter()
          .append("rect"); 

        rectangles
        .attr("x", (d) => {
          let minTime = this.getMinTime(data)
          console.log(minTime)
          return (this.get24Time(d.date_time)-minTime) * 170; 

        })
        .attr("y", (d) =>{
          return 1 * 50; 
        })
        .attr("width", 50)
        .attr("height", 50). 
        style("fill", (d)=>{
          return colorScale(d.heart_rate); 
        });
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

    getMinTime = (data) =>{
        let minTime = this.get24Time(data[0].date_time);
        for (let i = 0; i < data.length; i +=1) {
            if (this.get24Time(data[i].date_time) < minTime) {
                minTime = this.get24Time(data[i].date_time);
            }
        }
        return minTime
    }

    getHeartData = (userID) =>{
        //right now reads down the file to the time then processes that
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
                    console.log("uarr ")
                    let end = Math.floor(uarr.length/100000) + 1
                    //too big to process all at once, divide into 100,000 nums at once
                    let dataStr = ''
                    for(let i = 0; i < end; i+=1){
                        let arr = new Array(...uarr.slice(i*100000,(i+1)*100000)).map((x)=>String.fromCharCode(x)).join('')
                        dataStr = dataStr.concat(arr)
                    }
                    let dataPts = dataStr.split(/\n/)

                    //holds all the data(per second)
                    let dataDay = []
                    //gather all
                    for(let j = 0; j < dataPts.length; j +=1){
                        let data = dataPts[j].split(',')
                        let value = parseFloat(data[1])
                        if(value != 0){
                            dataDay.push([data[0], value])
                        }
                    }  

                    //get the average for 5 minutes
                    let dataMinutes = []
                    let minuteMax = this.get24Time(dataDay[0][0]) + 5/60//for every 5 min
                    let sum = 0//value sum
                    let total = 0//num of data pts
                    let k = 0//index for data
                    while(k < dataDay.length){
                        //same min- add to total, count
                        let time = this.get24Time(dataDay[k][0])
                        if(time < minuteMax){
                            total += 1
                            sum = sum + dataDay[k][1]//floats
                        }else{
                            let av = sum/total
                            dataMinutes.push({'date_time' : dataDay[k-1][0].slice(0,16), 'heart_rate': av})//stores [date_time, avheartrate]
                            //reset for new minute
                            minuteMax = time+5/60
                            sum = dataDay[k][1]
                            total = 1
                        }
                        k += 1
                    }
                    this.setState({
                        data: dataMinutes
                    })
                    var colorDomain = d3.extent(data, function(d){
                      return d.value;
                    });
                    var colorScale = d3.scaleLinear()
                      .domain(colorDomain)
                      .range(["lightblue","blue"]);
                });
                reader.readAsArrayBuffer(blob);
            };
            xhr.open('GET', url);
            xhr.send();
        }); 
    }

    processForDay = (date) =>{
        //gets all the data for the day
        let seen = false
        let min = 500
        let max = 0
        let dataDay = []
        for(let i = 0; i < this.state.data.length; i+=1){
            if(this.state.data[i]['date_time'].slice(0,10) == date){
                dataDay.push(this.state.data[i])
                seen = true
            }else if(seen){
                break
            }
            if(this.state.data[i]['heart_rate'] <= min){
                min = this.state.data[i]['heart_rate']
            } if(this.state.data[i]['heart_rate'] >= max){
                max = this.state.data[i]['heart_rate']
            }
        }
        this.makeSections(dataDay, min, max)
    }

    reformatDate = (chosenDate) =>{
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
        //need to make soemthing to process for a day then make is show
        let day = this.reformatDate(this.props.date)
        if(day != this.state.oldDay){//when day changes
            this.processForDay(day)//will trigger didUpdate
            this.setState({
                oldDay: day
            })
        }
    }

    componentDidMount(){//run once in beginning
        this.getHeartData(this.props.uid)//get all data once
        //set day when first made so we know if the day changes later
        let day = this.reformatDate(this.props.date)
        this.setState({//will trigger didUpdate
            oldDay: day
        })
    }

    render() {
        return <div className="heart-heat-map" id={"#" + this.props.id}></div>
        // return (
        //     return <div id={"#" + this.props.id}></div>
        // );
    }
}

export default HeartHeatMap;