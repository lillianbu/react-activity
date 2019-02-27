import React from "react";
import "../css/app.css";
import firebase from '../../../firebase';

class Images extends React.Component {
    constructor(props){
        super(props);
    }

    getImage = () => {
        try { 
        var storage = firebase.storage(); 
        var gsRef = storage.refFromURL('gs://languagelearning-17d88.appspot.com/06-21-07_2018-27-July.jpg'); 
        gsRef.getDownloadURL().then(function(url) {
            console.log(url); 
            var img = document.getElementById("myimg"); 
            img.src = url; // replaces blank image
            console.log("image downloaded from firebase");
        }); 

        }
        catch (error) {
            switch (error.code) {
                case 'storage/object-not-found':
                // File doesn't exist
                break;

                case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
        }
    }
}

    render() {
        //console.log(this.state.userInfo)
        return (
            <div>
                <h1>Image from sample time</h1>
                    <div>
                    <img id = "myimg" src='http://www.debbiesdayspasalon.com/wp-content/uploads/2015/10/blank-500x500.png' style={{width: 500 +'px', height: 500+'px'}}/>
                    </div>
                    <div>
                    <button onClick={this.getImage}>Get image</button>
                    </div>
            </div>
            );
    }
}

export default Images;