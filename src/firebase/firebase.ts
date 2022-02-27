import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBsosvz5YiJU525VE-YoXJ2ZaLYl7eFKKs",
    authDomain: "chess-online-7aa1c.firebaseapp.com",
    projectId: "chess-online-7aa1c",
    storageBucket: "chess-online-7aa1c.appspot.com",
    messagingSenderId: "384008796205",
    appId: "1:384008796205:web:d8449be85424878c11a0a4",
    measurementId: "G-6L9KC069GW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();
export const auth = getAuth();
