import React from "react";
import "../css/app.css";

class Home extends React.Component {

  constructor(props){
    super(props);
  }

  redirectToTarget = () => {
    this.props.history.push('/profile')//sends to home
  }

  render() {
    return (
      <div>
        Home
        <button onClick={this.redirectToTarget}>Profile</button>
      </div>
    )
    ;
  }
}

export default Home;