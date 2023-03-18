import * as functions from "firebase-functions";
import { db } from "../utils/firebase";

export const handleGetUserTotalStatistics = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const uid: string = data.uid;

    //? get statistics references
    const userRef = db.collection("users").doc(uid);
    const totalStatisticsRef = userRef
      .collection("statistics")
      .doc("totalStatistics");

    try {
      //? get user statistics
      const totalStatisticsSnapshot = await totalStatisticsRef.get();

      const totalStatistics = totalStatisticsSnapshot.data();

      return { success: true, ...totalStatistics };
    } catch (error) {
      console.error("Error getting user statistics: ", error);
      return { success: false, error: error };
    }
  });
