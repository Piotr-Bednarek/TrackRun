import { initializeApp } from "firebase/app";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_CONFIG_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_CONFIG_APP_ID,
};

// import "firebase/firestore";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

const functions = getFunctions(app, "europe-west1");
connectFunctionsEmulator(functions, "localhost", 5001);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Successfully set persistence");
  })
  .catch((error) => {
    console.log("Error setting persistence: ", error);
  });

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);

    const user = res.user;
    return { user: user, message: "Successfully logged in!" };
  } catch (error) {
    return { message: "Error while logging in!" };
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

const getUserByUid = async (uid: string) => {
  // TODO: get user from database

  console.log("test");
  console.log(uid);

  const userRef = doc(db, "users", uid);

  const userSnap = await getDoc(userRef);

  // console.log("userSnap: ", userSnap);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    console.log("User found!");
    return { message: "User found!", userData: userData };
  } else {
    console.log("No such user!");
    return { error: "No such user!" };
  }
};

export { signInWithGoogle, logOut, auth, getUserByUid, functions };
