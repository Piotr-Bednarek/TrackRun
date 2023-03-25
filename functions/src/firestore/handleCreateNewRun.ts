import { Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

import { firebaseApp } from "../firebase";

const db = firebaseApp.firestore();

export const handleCreateNewRun = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    try {
      const uid: string = data.uid;

      const timestamp = Timestamp.now();

      const runData = { runDate: timestamp, ...data.runData };

      const userRef = db.collection("users").doc(uid);
      const runsRef = userRef.collection("runs");

      const runRef = runsRef.doc();
      await runRef.set(runData);

      return { success: true };
    } catch (error) {
      console.error("Error adding run to database: ", error);
      return { success: false, error: error };
    }
  });
