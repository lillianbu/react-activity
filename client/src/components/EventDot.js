import React from "react";
import "../css/app.css";
import "../css/form.css";
import { callbackify } from "util";
import { pipeline } from "stream";
import Popup from "reactjs-popup";
import UpdateInfo from "./UpdateInfo"
import Modal from 'react-modal';

// Modal.setAppElement('el');

class EventDot extends React.Component {
    constructor(props){
        super(props)

        this.state = {
          modalIsOpen: false
        };
    }

    getPos = () =>{
        //take time to get theta, scale to get r
        let theta = (this.getTime()/12)*2*3.141593
        //angle from the vertical axis, need to shift x=sin y=-cos(inverted y axis)
        let x = String(Math.sin(theta))
        let y = String(-Math.cos(theta))
        //50% makes center (0,0), 49% so not all the way out, 14px section for thickness of dot
        let yval = 'calc(50% + 49% * ' + y + ' - (.5 + .49 * ' + y + ') * 14px)'
        let xval = 'calc(50% + 49% * ' + x + ' - (.5 + .49 * ' + x + ') * 14px)'
        return {top: yval, left: xval}
    }

    displayTime = () =>{
        let time = this.props.time.split(" ")
        this.props.passTime(time[0])//callback from Home to pass time up when clicked
        console.log(this.props.time)
        //shows tooltip
        let tooltip = document.getElementById(this.props.time)
        tooltip.style.visibility = "visible";
    }

    getTime = () =>{
        //time comes in as 01:55am
        let hour = Number(this.props.time.slice(0,2))//would return 1
        let min = Number(this.props.time.slice(3,5))//would return 55
        return (hour%12 + min/60)
    }

    closeTooltip = () =>{
        let tooltip = document.getElementById(this.props.time)
        tooltip.style.visibility = "hidden";
    }

    openModal = () => {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '000000';
    }

    closeModal = () => {
        this.setState({modalIsOpen: false});
    }


    render() {
        //time is id for now, later make into imageName, and then make a parser to get time, etc from that
        let side = {left: '20px'}
        if (this.getTime() > 6){
            side = {right: '5px'}
        }
        return (
            <div id={String(this.props.date+this.props.time)} className="top" style={this.getPos()}>
                <span className="dot top" onClick={this.displayTime}></span>
                <span className="tooltip">
                    <div id={this.props.time} className="tooltiptext" style={side}>
                        from: {this.props.time}
                        <br/>{this.props.activity}, {this.props.location}
                        <div className="xbutton" onClick={this.closeTooltip}>&times;</div>
                        <button onClick={this.openModal}>Update Info</button>
                        <Modal
                          isOpen={this.state.modalIsOpen}
                          onAfterOpen={this.afterOpenModal}
                          onRequestClose={this.closeModal}
                          className="modal-update center"
                          contentLabel="Example Modal"
                        >

                          <h2 ref={subtitle => this.subtitle = subtitle}>Update Info</h2>

                          <UpdateInfo 
                              user={this.props.user}//ref
                              date={this.props.date}//ref
                              time={this.props.time}//ref
                              activity={this.props.activity}
                              //name={this.props.name}
                              relationship={this.props.relationship}
                              location={this.props.location}
                              closeModal={this.closeModal}
                          />
                          <div style={{fontSize: '20px'}} className="xbutton" onClick={this.closeModal}>&times;</div>
                        </Modal>

                    </div>
                </span>
            </div>
        )
    }
}

Modal.setAppElement('body');

export default EventDot;