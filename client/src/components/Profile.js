import React from "react";
import "../css/app.css";

class Profile extends React.Component {
    constructor(props){
        super(props);

    }
    render() {
        //console.log(this.state.userInfo)
        return (
            <div style={{padding:15+'px'}}>
                Profile- needs name, most recent image, first image, last few hours?
                <h1>User Name</h1>
                <div className='row'>
                    <div className='column'>
                        <p>Most Recent Image</p>
                        <img src='testnew.jpg' style={{width: 300 +'px', height: 300+'px'}}/>
                    </div>
                    <div className='column'>
                        <p>Oldest Image</p>
                        <img src='testold.jpg' style={{width: 300 +'px', height: 300+'px'}}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;