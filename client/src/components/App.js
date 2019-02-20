import React from "react";
import "../css/app.css";
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch"
import ClockSelector from "./ClockSelector"
import Root from "./Root"

class App extends React.Component {
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