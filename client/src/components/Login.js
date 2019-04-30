import React from "react";
import "../css/app.css";
import fire, { auth, provider } from '../../../firebase';
import Link from 'react-router-dom/Link';

class Login extends React.Component {

  constructor(props) {
    super(props);
  }

  login = (event) => {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          userInfo: user
        });
        console.log("user in login: ", user);
        this.props.passUser(user);//callback to send user info to app
        this.props.history.push('/home');//sends to home
      }
    );
  }

  render() {
    return (
      <div className="center">
        <h1>PAL Activity</h1>
        <span>
          <button onClick={this.login}>Login through Firebase</button>
        </span>
      </div>
    );
  }
}

export default Login;