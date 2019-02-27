import React from "react";
import "../css/app.css";
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch"
import ClockSelector from "./ClockSelector"
import Root from "./Root"
import Home from "./Home"
import Login from "./Login"
import Clock from "./Clock"

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        userInfo: null,
      }

  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/login" component={Login} user={this.state.user}/>
          <Route exact path="/home" component={Home} />
          <Route exact path="/" component={Clock} />
        </Switch>
      </div>
    )
    ;
  }
}

export default App;