import firebase from 'firebase';

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyDB4x0El_GfVt38owCeVu5CpsTFiLbP07Y",
    authDomain: "instagram-2021.firebaseapp.com",
    databaseURL: "https://instagram-2021.firebaseio.com",
    projectId: "instagram-2021",
    storageBucket: "instagram-2021.appspot.com",
    messagingSenderId: "585743769433",
    appId: "1:585743769433:web:441b55ddb030cb34e73648",
    measurementId: "G-B1MGXCE3S9"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
