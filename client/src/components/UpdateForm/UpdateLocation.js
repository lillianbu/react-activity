import React from 'react'
import "../../css/app.css";
import "../../css/form.css";

export default class UpdateLocation extends React.Component {
	constructor(props){
	    super(props);
	  }

	  
    render () {
        let message = "You selected" + this.props.location;
        return (
        	<div>
                <label>
                Location:
                    <select value={this.props.location} onChange={this.props.sendData}>
                    <option value="office">Office</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bedroom">Bedroom</option>
                    </select>
                </label>
                <p>{message}</p>
        	</div>
    	)
    }
};