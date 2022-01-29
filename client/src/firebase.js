// import * as firebase from "firebase";
import firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAawUk92JglkQ9PASGojdtR8gFxWkmdc5I",
  authDomain: "e-tack.firebaseapp.com",
  projectId: "e-tack",
  storageBucket: "e-tack.appspot.com",
  messagingSenderId: "294081738501",
  appId: "1:294081738501:web:f854f6c98d195b060a696c",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
