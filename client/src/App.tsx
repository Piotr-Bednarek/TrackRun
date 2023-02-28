import { useState, useEffect } from "react";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getRedirectResult,
  signOut,
} from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import "./App.css";

function App() {
  const [message, updateMessage] = useState("");

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_CONFIG_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_CONFIG_APP_ID,
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  //create useeffect to get redirect result
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user: ", user);
        updateMessage("user logged in");
      } else {
        console.log("user not logged in");
        updateMessage("user not logged in");
      }
    });

    getRedirectResult(auth)
      .then((result) => {
        if (!result) {
          return;
        }
        console.log("result: ", result);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  const handleLogin = () => {
    console.log("Login clicked");

    signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    signOut(auth);
  };

  return (
    <div className="App">
      <p>mail: piotrbednarek04@gmail.com</p>
      <p>password: qwe123</p>
      <button onClick={() => handleLogin()}>sign in with google</button>
      <button onClick={() => handleLogout()}>sign out</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
