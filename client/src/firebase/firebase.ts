import { initializeApp } from "firebase/app";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_CONFIG_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_CONFIG_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);

    const user = res.user;
    console.log("user: ", user);
  } catch (error) {
    console.log(error);
  }
};

const logOut = () => {
  signOut(auth)
    .then(() => {
      console.log("user logged out");
      return { message: "user logged out" };
    })
    .catch((error) => {
      console.log("error: ", error);
      return { message: "error" };
    });
};

export { signInWithGoogle, logOut, auth };
