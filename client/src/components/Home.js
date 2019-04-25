import React from "react";
import "../css/app.css";
import Clockface from "./Clockface";

class Home extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      am: 'am',
      hour: "one"
    }
  }

  redirectToTarget = () => {
    this.props.history.push('/profile')//sends to home
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
      document.getElementById('pm').className = "btn"
    }
  }

  togglePm = () => {
    if(this.state.am == 'am'){//am to pm
      this.setState({
        am: 'pm'
      })
      document.getElementById('am').className = "btn"
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
    return (
      <div className="center">
        <div className="clock-container">
          <h1>PAL Activity App</h1>
          <button onClick={this.redirectToTarget}>Profile</button>
          <Clockface am={this.state.am} passTime={this.passTime} goToUpdate={this.goToUpdate} user={this.props.user}/>
          <div>
            <button id="am" className="btn_dark" onClick={this.toggleAm}>AM</button>
            <button id="pm" className="btn" onClick={this.togglePm}>PM</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;