import React from 'react'
import "../../css/app.css";
import "../../css/form.css";

export default class UpdateActivity extends React.Component {
	constructor(props){
	    super(props);

	  }
	  
    render () {
        return (
        	<div>
                <label>
                  Name:
                  <input type="text" value={this.props.name} onChange={this.props.sendData} />
                </label>
        	</div>
    	)
    }
};