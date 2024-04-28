
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCJLO7_TCiedBqOwvHwhIjhFXzxQu2q-nk",
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