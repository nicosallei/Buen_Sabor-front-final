// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDH2FTb-OjQCz0AEf0qMUJUOiy2j51j5JI",
  authDomain: "buensabor-21567.firebaseapp.com",
  projectId: "buensabor-21567",
  storageBucket: "buensabor-21567.appspot.com",
  messagingSenderId: "955306842839",
  appId: "1:955306842839:web:1eabbb319e019ba4fcee92",
  measurementId: "G-EW8F2WYZF1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
