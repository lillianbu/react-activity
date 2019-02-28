import React from "react";
import "../css/app.css";
import Images from "./Images.js";

class Profile extends React.Component {
    constructor(props){
        super(props);
    }

    redirectToTarget = () => {
        this.props.history.push('/home')//sends to home
    }
    
    render() {
        return (
            <div style={{padding:15+'px'}}>
                <button onClick={this.redirectToTarget}>Home</button>
                <div className="incenter">
                    <h1>PAL Activity App</h1>
                    <h1>{this.props.user.displayName}</h1>
                </div>
                <div className='row'>
                    <div className='column'>
                        <Images imageID="img54" userID={this.props.user.uid} imageName="06-20-54_2018-27-July.jpg"/>
                    </div>
                    <div className='column'>
                        <Images imageID="img56" userID={this.props.user.uid} imageName="06-20-56_2018-27-July.jpg"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;