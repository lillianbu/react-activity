import React from 'react'
import "../../css/app.css";
import "../../css/form.css";

export default class UpdateRelationship extends React.Component {
	constructor(props){
	    super(props);
	  }

	  
    render () {
        let message = "You selected " + this.props.relationship;
        return (
        	<div>
                <label>
                Relationship: 
                    <select value={this.props.relationship} onChange={this.props.sendData}>
                    <option value="family">Family</option>
                    <option value="friend">Friend</option>
                    <option value="Aquaintance">Aquaintance</option>
                    <option value="Coworker">Coworker</option>
                    </select>
                </label>
                <p>{message}</p>
        	</div>
    	)
    }
};