import fire from '../../../firebase';

var config = {
    apiKey: "AIzaSyCC5ddm8XmfWFpv7ZImVQQLK29wKk-IukI",
    authDomain: "languagelearning-17d88.firebaseapp.com",
    databaseURL: "https://languagelearning-17d88.firebaseio.com",
    projectId: "languagelearning-17d88",
    storageBucket: "languagelearning-17d88.appspot.com",
    messagingSenderId: "20912817989"
};
firebase.initializeApp(config); // accesses firebase storage for LanguageLearning

export default firebase; 