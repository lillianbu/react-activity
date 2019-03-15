import React from "react";
import "../css/app.css";
import firebase from '../../../firebase';
import { strict } from "assert";

class Images extends React.Component {
    constructor(props){
        super(props);
    }

    getImage = (imgID, userID, imageName) => {
        try { 
        var storage = firebase.storage(); 
        // let refurl = 'gs://languagelearning-17d88.appspot.com/Activity_Data/activity_data.csv'
        var refurl = 'gs://activity2019-f8035.appspot.com/users/'+userID+'/images/'+imageName;
        console.log(refurl);
        var gsRef = storage.refFromURL(refurl); 
        gsRef.getDownloadURL().then(function(url) {
            console.log(url); 
            var img = document.getElementById(imgID); 
            img.src = url; // replaces blank image
            console.log("image downloaded from firebase");
        }); 
   
        }
        catch (error) {
            console.log(error);
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

    componentDidMount = () => {
        //imageID is just to find on the page, probably can replace with image name
        this.getImage(this.props.imageID, this.props.userID, this.props.imageName);
    }

    render() {
        //can later change this to receive time information, which can then be converted
        //into a url and into the image description, and also image id
        return (
            <div>
                <p>Image Name: {this.props.imageName}</p>
                <div>
                    <img id = {this.props.imageID} src='http://www.debbiesdayspasalon.com/wp-content/uploads/2015/10/blank-500x500.png' style={{width: 500 +'px', height: 500+'px'}}/>
                </div>
            </div>
            );
    }
}

export default Images;