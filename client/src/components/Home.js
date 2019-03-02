import React from "react";
import "../css/app.css";
import Clockface from "./Clockface";

class Home extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      am: true
    }
  }

  redirectToTarget = () => {
    this.props.history.push('/profile')//sends to home
  }

  redirectToImages = () => {
    this.props.history.push('/images')
  }

  toggle = () => {
    this.setState({
      am: !this.state.am
    })
    console.log(this.state.am)
  }

  render() {
    return (
      <div className="center">
        <div className="clock-container">
          <h1>PAL Activity App</h1>
          <button onClick={this.redirectToTarget}>Profile</button>
          <button onClick={this.redirectToImages}>Images</button>
          <div className = "clockface">
            <Clockface />
          </div>
          <div>
            <button onClick={this.toggle}>AM</button>
            <button onClick={this.toggle}>PM</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;