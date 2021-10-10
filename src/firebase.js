import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC8xqMMWBJdpwW8sh1SuswDL50aTS_0GWo",
    authDomain: "givr-86d00.firebaseapp.com",
    projectId: "givr-86d00",
    storageBucket: "givr-86d00.appspot.com",
    messagingSenderId: "645843949957",
    appId: "1:645843949957:web:90642090e59e7c00a94cec",
    measurementId: "G-GEJ5E98DNL"
  };
  
const app = initializeApp(firebaseConfig)
export default getFirestore()  
