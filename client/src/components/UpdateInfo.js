import React from 'react'
import "../css/app.css";
import "../css/form.css";
import UpdateActivity from "./UpdateForm/UpdateActivity";
import UpdateName from "./UpdateForm/UpdateName";
import UpdateRelationship from "./UpdateForm/UpdateRelationship";
import UpdateLocation from "./UpdateForm/UpdateLocation";
import { database } from '../../../firebase';

export default class UpdateInfo extends React.Component {
	constructor(props){
	    super(props);

	    this.state = {
	    	activity: "sleep",
	    	name: "lillian",
	    	relationship: "friend",
	    	location: "kitchen",
	    };
	  }

	 getActivityData = (e) => {
	 	this.setState({
	 		activity: e.target.value,
	 	});
	 	console.log(this.state.activity);
	 }

	 getNameData = (e) => {
	 	this.setState({
	 		name: e.target.value,
	 	});
	 	console.log(this.state.name);
	 }

	 getRelationshipData = (e) => {
	 	this.setState({
	 		relationship: e.target.value,
	 	});
	 	console.log(this.state.relationship);
	 }

	 getLocationData = (e) => {
	 	this.setState({
	 		location: e.target.value,
	 	});
	 	console.log(this.state.location);
	 }

	 // writeUserData = () => {
	 //  console.log("sending to database")
  //     database.ref('users/' + this.props.user.displayName).set({
  //       name: this.state.name,
  //       activity: this.state.activity,
  //       relationship : this.state.relationship,
  //       location: this.state.location
  //     });
  //   }

	 handleSubmit = (e) => {
	 	alert('Your form was submitted' + this.state.activity + this.state.name + this.state.relationship + this.state.location);
	 	// writeUserData();
	 	console.log("sending to database")
	      database.ref('users/' + this.props.user.displayName).set({
	        name: this.state.name,
	        activity: this.state.activity,
	        relationship : this.state.relationship,
	        location: this.state.location
	      });
    	event.preventDefault();
	 }

    render () {
        return (
        	<div>
        		<form onSubmit={this.handleSubmit}>
        			<UpdateActivity activity={this.state.activity} sendData={this.getActivityData}/>
        			<UpdateName name={this.state.name} sendData={this.getNameData}/>
        			<UpdateRelationship relationship={this.state.relationship} sendData={this.getRelationshipData}/>
        			<UpdateLocation location={this.state.location} sendData={this.getLocationData}/>
        			<input type="submit" value="Submit" />
        		</form>
        	</div>
    	)
    }
};
