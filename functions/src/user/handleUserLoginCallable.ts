import * as functions from "firebase-functions";

import { firebaseApp } from "../firebase";

const db = firebaseApp.firestore();

export const handleUserLoginCallable = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const idToken: string = data.idToken;

    const decodedToken = await firebaseApp.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    await addUserToDatabaseIfNotExists(uid);

    return { success: true, uid: uid };
  });

const addUserToDatabaseIfNotExists = async (uid: string) => {
  const userRef = db.collection("users").doc(uid);

  const snapshot = await userRef.get();

  if (snapshot.exists) {
    console.log("User already exists", uid);
    return;
  } else {
    const user = await firebaseApp.auth().getUser(uid);

    //? create new user in database
    await userRef.create({
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.metadata.creationTime,
    });

    // ? create statistics collection for user
    const statisticsRef = userRef.collection("statistics");
    await statisticsRef.doc("totalStatistics").create({});
    await statisticsRef.doc("weeklyStatistics").create({});

    console.log("Successfully added new user to database: ", uid);
  }
};
