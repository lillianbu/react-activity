import React from "react";
import "../css/app.css";
import fire, { auth, provider } from '../../../firebase';

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
        console.log(this.state.userInfo)
        this.props.history.push('/home')//sends to home
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.login}>Login through Firebase</button>
      </div>
    );
  }
}

export default Login;