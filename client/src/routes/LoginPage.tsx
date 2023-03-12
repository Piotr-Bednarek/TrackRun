import { signInWithGoogle } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useState, useEffect } from "react";

import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);
  const [uid, setUid] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");

  const [userPhotoUrl, setUserPhotoUrl] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // name a function that will handle the login api call

  const handleUserLogin = httpsCallable(functions, "handleUserLoginCallable");

  // const handleLoginApiCall = async () => {
  //   const user = auth.currentUser;

  //   if (!user) {
  //     return;
  //   }

  //   await user.getIdToken().then((idToken: string) => {
  //     fetch(
  //       "http://127.0.0.1:5001/track-run-b9950/europe-west1/handleUserLogin",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ idToken: idToken }),
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);
  //         setUid(data.uid);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   });
  // };

  const handleLogin = async () => {
    console.log("Login clicked");
    const result = await signInWithGoogle();

    setMessage(result.message);
    setUser(result.user);

    try {
      const idToken = await result.user?.getIdToken();
      // console.log(idToken);
      const response = await handleUserLogin({ idToken });
      console.log(response);
      const data = response.data as { uid: string };
      console.log(data.uid);
      setUid(data.uid);
      if (result.user?.uid) {
        console.log(result.user?.uid);
        // setTimeout(() => {
        navigate("/user/" + result.user?.uid);
        // }, 1000);
      }
    } catch (error) {
      console.log("Error! ", error);
    }
  };

  return (
    <div>
      <button onClick={() => handleLogin()}>sign in with google</button>
      <p>{message}</p>
      <p>{uid}</p>
    </div>
  );
}
