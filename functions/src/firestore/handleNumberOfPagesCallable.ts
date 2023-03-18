import * as functions from "firebase-functions";

import { firebaseApp } from "../firebase";

const db = firebaseApp.firestore();

export const handleNumberOfPagesCallable = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const uid: string = data.uid;

    const userRef = db.collection("users").doc(uid);

    const runsCollectionRef = userRef.collection("runs");

    const snapshot = await runsCollectionRef.get();

    const numberOfRuns = snapshot.size;

    const numberOfPages = Math.ceil(numberOfRuns / 10);

    console.log("numberOfRuns: ", numberOfRuns);

    return { success: true, numberOfPages: numberOfPages };
  });
