import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import "./App.css";

import { signInWithGoogle, logOut, auth } from "./firebase/firebase";

function App() {
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [userUid, setUserUid] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setMessage(`Hello ${user.displayName}`);
        console.log(user.uid);
        setUserUid(user.uid);
        setUser(user);
        // console.log(user);
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

  const test = () => {
    user
      .getIdToken()
      .then((idToken: string) => {
        console.log(idToken);
        fetch("http://localhost:3000/api/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken: idToken }),
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <p>mail: piotrbednarek04@gmail.com</p>
      <p>password: qwe123</p>
      <button onClick={() => handleLogin()}>sign in with google</button>
      <button onClick={() => handleLogout()}>sign out</button>
      <p>{message}</p>
      <p>{userUid}</p>
      <button onClick={() => test()}>TEST</button>
    </div>
  );
}

export default App;
