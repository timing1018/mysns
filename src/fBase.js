import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId:process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDER_ID,
  appId: process.env.REACT_APP_APP_ID,

  // apiKey: "AIzaSyBxGAnue_n4qR_PviRx-CHT5rQmBXO_cTc",
  // authDomain: "mysns-12637.firebaseapp.com",
  // projectId: "mysns-12637",
  // storageBucket: "mysns-12637.appspot.com",
  // messagingSenderId: "906959167768",
  // appId: "1:906959167768:web:0a2e9e50886d22ef48fe6d"
};

const app = initializeApp(firebaseConfig);
export const authService = getAuth(app);