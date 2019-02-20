import React from "react";
import "../css/app.css";
import fire, { auth, provider } from '../../../firebase';
import Link from "react-router-dom/es/Link";

class Login extends React.Component {

constructor() {
    super();
  }


login = (event) => {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
        console.log(this.state.user)
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.login}>Login through Firebase</button>
      </div>
    )
    ;
  }
}

export default Login;