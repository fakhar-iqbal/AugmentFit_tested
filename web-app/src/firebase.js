// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWYrBNfMqZGES42H-uhgjJxLwrn4aOaKs",
  authDomain: "augmentfit.firebaseapp.com",
  projectId: "augmentfit",
  storageBucket: "augmentfit.appspot.com",
  messagingSenderId: "386253428165",
  appId: "1:386253428165:web:38807e98aa4cf56697a7ac"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, auth};

