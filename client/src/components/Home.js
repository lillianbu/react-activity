import React from "react";
import "../css/app.css";

class Home extends React.Component {

  constructor(props){
    super(props);
  }

  redirectToTarget = () => {
    this.props.history.push('/profile')//sends to home
  }

  redirectToClockImage = () => {
    this.props.history.push('/images')
  }


  render() {
    return (
      <div>
        Home
        <button onClick={this.redirectToTarget}>Profile</button>
        <button onClick={this.redirectToClockImage}>Images</button>
      </div>
    )
    ;
  }
}

export default Home;