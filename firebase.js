import firebase from 'firebase'

let config = {
    apiKey: "AIzaSyDjpUWSc62qBw35wNiVsFr4i_HhdHOK5QY",
    authDomain: "activity2019-f8035.firebaseapp.com",
    databaseURL: "https://activity2019-f8035.firebaseio.com",
    projectId: "activity2019-f8035",
    storageBucket: "activity2019-f8035.appspot.com",
    messagingSenderId: "1066390808701"
  };

const fire = firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const database = firebase.database();
export default fire;