// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-e19bc.firebaseapp.com",
    projectId: "mern-estate-e19bc",
    storageBucket: "mern-estate-e19bc.appspot.com",
    messagingSenderId: "910982888646",
    appId: "1:910982888646:web:d1d7ba9d3e26dbe9596bc7",
    measurementId: "G-HPK4XB81FF"
};

// Initialize Firebase
// const analytics = getAnalytics(app);
export const app = initializeApp(firebaseConfig);