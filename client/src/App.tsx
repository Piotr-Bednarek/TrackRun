import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import "./App.css";

import { signInWithGoogle, logOut, auth } from "./firebase/firebase";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setMessage(`Hello ${user.displayName}`);
        console.log(user);
      } else {
        setMessage("Hello stranger");
        console.log("no user");
      }
    });
  });

  const handleLogin = () => {
    console.log("Login clicked");
    signInWithGoogle();
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    logOut();
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
