// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, deleteDoc, doc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "teht8-abdd0.firebaseapp.com",
  projectId: "teht8-abdd0",
  storageBucket: "teht8-abdd0.appspot.com",
  messagingSenderId: "932511765293",
  appId: "1:932511765293:web:784a6ced3fee9ea8f279a4",
  measurementId: "G-NTD5RF760Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

const PRODUCTS = 'products';

export{
    firestore,
    collection,
    addDoc,
    serverTimestamp,
    doc,
    deleteDoc,
    PRODUCTS
};