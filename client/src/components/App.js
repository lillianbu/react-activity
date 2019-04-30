import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/app.css";
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch"
//pages
import Home from "./Home"
import Login from "./Login"
import Profile from "./Profile"
import Images from "./Images"
import UpdateInfo from "./UpdateInfo"
//navbar
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Link from "react-router-dom/Link";

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        user: undefined,
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
        {this.state.user == undefined ? console.log("not logged in"):
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/home">PAL Activity</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <Link class="nav-link" to="/profile">Profile</Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        }
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