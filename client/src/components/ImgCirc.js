import React from "react";
import "../css/app.css";
import firebase from '../../../firebase';
import { strict } from "assert";

class ImgCirc extends React.Component {
    constructor(props){
        super(props);
    }

    getImage = (imgID, userID, imageName) => {
        //currently is manualy selected img
        try { 
            let storage = firebase.storage(); 
            imageName = 'unknown-07-12-40_2019-02-May.png'
            let refurl = 'gs://activity2019-f8035.appspot.com/users/4afb720a-5214-4337-841b-d5f954214877/Faces/' + imageName;
            console.log(refurl);
            let gsRef = storage.refFromURL(refurl); 
            gsRef.getDownloadURL().then(function(url) {
                console.log(url); 
                let img = document.getElementById(imgID); 
                img.src = url; // replaces blank image
                console.log("image downloaded from firebase");
            }); 
        }
        catch (error) {
            console.log(error);
            switch (error.code) {
                case 'storage/object-not-found':
                    break;// File doesn't exist
                case 'storage/unauthorized':
                    break;// User doesn't have permission to access the object
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
            <img id = {this.props.imageID} src="BLANK_ICON.png" className='imgcirc'/>
        );
    }
}

export default ImgCirc;