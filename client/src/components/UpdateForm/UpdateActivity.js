import React from 'react'
import "../../css/app.css";
import "../../css/form.css";

export default class UpdateActivity extends React.Component {
	constructor(props){
	    super(props);
	  }

	  
    render () {
        let message = "You selected" + this.props.activity;
        return (
        	<div>
                <label>
                Activity:
                    <select value={this.props.activity} onChange={this.props.sendData}>
                    <option value="sleep">Sleep</option>
                    <option value="work">work</option>
                    <option value="play">play</option>
                    </select>
                </label>
                <p>{message}</p>
        	</div>
    	)
    }
};
