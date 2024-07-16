//FirebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAUd3sLjpgcAR0FXiRpW7JO2fyviJ_E6gU",
  authDomain: "fir-project-6a429.firebaseapp.com",
  projectId: "fir-project-6a429",
  storageBucket: "fir-project-6a429.appspot.com",
  messagingSenderId: "927869534111",
  appId: "1:927869534111:web:df2d41814f69ee0b0c87aa",
  measurementId: "G-HE3TRWKBF3"
};


export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
