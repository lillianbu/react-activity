import React from "react";
import "../css/app.css";
import Images from "./Images.js";
import Redirect from "react-router-dom/Redirect";


class Profile extends React.Component {
    constructor(props){
        super(props);
    }
    
    render() {
        if(this.props.user == undefined){
            return <Redirect to="/"/>
        }else{
            return (
                <div style={{padding:15+'px'}}>
                    <div className="incenter">
                        <h1>{this.props.user.displayName}</h1>
                    </div>
                    {/* <div className='row'>
                        <div className='column'>
                            <Images imageID="img54" userID={this.props.userID} imageName="06-20-54_2018-27-July.jpg"/>
                        </div>
                        <div className='column'>
                            <Images imageID="img56" userID={this.props.userID} imageName="06-20-56_2018-27-July.jpg"/>
                        </div>
                    </div> */}
                </div>
            );
        }
    }
}

export default Profile;