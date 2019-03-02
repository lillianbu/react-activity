import React from "react";
import "../css/app.css";

class Home extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      am: true,
      word: "am",
      hour: "one"
    }
  }

  redirectToTarget = () => {
    this.props.history.push('/profile')//sends to home
  }

  toggleAm = () => {
    if(!this.state.am){//pm to am
      this.setState({
        am: true,
        word: "am"
      })
      document.getElementById('am').className = "btn_dark"
      document.getElementById('pm').className = "btn"
    }
  }

  togglePm = () => {
    if(this.state.am){//am to pm
      this.setState({
        am: false,
        word: "pm"
      })
      document.getElementById('am').className = "btn"
      document.getElementById('pm').className = "btn_dark"
    }
  }

  render() {
    return (
      <div className="center">
        <div className="clock-container">
          <h1>PAL Activity App</h1>
          <p>it is: {this.state.hour}{this.state.word}</p>
          <button onClick={this.redirectToTarget}>Profile</button>
          <div style={{padding:15+'px'}}>
            <img className="clockface" src={require('../css/clockface.png')}/>
          </div>
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