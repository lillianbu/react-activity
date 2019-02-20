import React from "react";
import "../css/app.css";
import Route from "react-router-dom/es/Route";
import Link from "react-router-dom/es/Link";
import Switch from "react-router-dom/es/Switch"
import ClockSelector from "./ClockSelector"
import Root from "./Root"
import Login from "./Login"
import Home from "./Home"
import fire, { auth, provider } from '../../../firebase';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null // <-- add this line
    }
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Login} user={this.state.user}/>
          <Route exact path="/home" component={Home} />
          <Route exact path="/clock" component={ClockSelector} />
        </Switch>
      </div>
    )
    ;
  }

}

export default App;