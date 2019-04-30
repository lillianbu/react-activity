import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/app.css";
import Clockface from "./Clockface";
import Redirect from "react-router-dom/Redirect";
// import Navbar from "react-bootstrap/Navbar";
// import Nav from "react-bootstrap/Nav";
// import Link from "react-router-dom/Link";
// import NavItem from "react-bootstrap/NavItem";

class Home extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      am: 'am',
      hour: "one"
    }
  }

  goToUpdate = () => {
        this.props.history.push('/update');//sends to home
  }

  toggleAm = () => {
    if(this.state.am == 'pm'){//pm to am
      this.setState({
        am: 'am',
      })
      document.getElementById('am').className = "btn_dark"
      document.getElementById('pm').className = "btn_light"
    }
  }

  togglePm = () => {
    if(this.state.am == 'am'){//am to pm
      this.setState({
        am: 'pm'
      })
      document.getElementById('am').className = "btn_light"
      document.getElementById('pm').className = "btn_dark"
    }
  }
  //pass time up, jsut for display above clock
  passTime = (time) =>{
    this.setState({
      hour: time
    })
  }

  render() {
    if(this.props.user == undefined){
      return <Redirect to="/"/>
    }else{
      return (
        <div>
          <div className="center">
            <div className="clock-container">
              {/* <h1>PAL Activity</h1>
              <button onClick={this.redirectToTarget}>Profile</button> */}
              <Clockface am={this.state.am} passTime={this.passTime} goToUpdate={this.goToUpdate} user={this.props.user}/>
              <div>
                <button id="am" className="btn_dark" onClick={this.toggleAm}>AM</button>
                <button id="pm" className="btn_light" onClick={this.togglePm}>PM</button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Home;