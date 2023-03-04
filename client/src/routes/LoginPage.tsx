import { signInWithGoogle } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);
  const [userUid, setUserUid] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");

  const [userPhotoUrl, setUserPhotoUrl] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // name a function that will handle the login api call

  const handleLoginApiCall = async () => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    user.getIdToken().then((idToken: string) => {
      fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: idToken }),
      })
        .then((res) => {
          res.json().then((text) => {
            console.log(text.success);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const handleLogin = async () => {
    console.log("Login clicked");
    const result = await signInWithGoogle();

    setMessage(result.message);
    setUser(result.user);

    handleLoginApiCall();

    if (result.user?.uid) {
      console.log(result.user?.uid);
      navigate("/user/" + result.user?.uid);
    }
  };

  return (
    <div>
      <button onClick={() => handleLogin()}>sign in with google</button>
      <p>{message}</p>
    </div>
  );
}
