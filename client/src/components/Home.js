import React from "react";
import "../css/app.css";

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
          <div style={{padding:15+'px'}}>
            <img className="clockface" src={require('../css/clockface.png')} />
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