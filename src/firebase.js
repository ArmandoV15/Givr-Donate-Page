import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeWGV0SNHRVuLzl2RiMv1wFDBUX_kY8ig",
  authDomain: "givr-5b981.firebaseapp.com",
  projectId: "givr-5b981",
  storageBucket: "givr-5b981.appspot.com",
  messagingSenderId: "457133173925",
  appId: "1:457133173925:web:1637681d625d88a397314c",
  measurementId: "G-J0CDGRL38V",
};

const app = initializeApp(firebaseConfig);
export default getFirestore();
