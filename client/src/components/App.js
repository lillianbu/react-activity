import React from "react";
import "../css/app.css";
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch"
import Home from "./Home"
import Login from "./Login"
import Profile from "./Profile"
import Images from "./Images"
import UpdateInfo from "./UpdateInfo"

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        userInfo: null,
      }

  }
  //used in Login to pass up user info
  loginPassUser = (user) => {
    this.setState({
      user: user
    });
}

render() {
    return (
      <div>
        <Switch>
          <Route exact path="/update" component={UpdateInfo}/>
          <Route exact path="/" render={(props) => <Login {...props} passUser={this.loginPassUser} />}/>
          <Route exact path="/home" render={(props) => <Home {...props} user={this.state.user}/>}/>
          <Route exact path="/images" component={Images}/>
          <Route exact path="/profile" render={(props) => <Profile {...props} user={this.state.user} />}/>
        </Switch>
      </div>
    )
    ;
  }
}

export default App;