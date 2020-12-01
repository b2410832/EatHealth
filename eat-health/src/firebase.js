import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/storage';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyA9vfuI1awPBy6mM1L7brpdp_A8DwRUiXM",
    authDomain: "eatwell-a0ca6.firebaseapp.com",
    databaseURL: "https://eatwell-a0ca6.firebaseio.com",
    projectId: "eatwell-a0ca6",
    storageBucket: "eatwell-a0ca6.appspot.com",
    messagingSenderId: "132579403086",
    appId: "1:132579403086:web:0e5e6421b24c66c0682a1f",
    measurementId: "G-JK8LJLGWZ2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create Firestore 
const db = firebase.firestore();

//  Create Storage
const storage = firebase.storage();

// Create Realtime database
const realtimeDB = firebase.database();

export { db, storage, realtimeDB };
