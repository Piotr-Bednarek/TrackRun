import * as functions from "firebase-functions";
import { db } from "../utils/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { RunLog } from "../types";

export const handleTotalStatisticsUpdate = functions
  .region("europe-west1")
  .firestore.document("users/{userId}/runs/{runId}")
  .onCreate(async (snapshot, context) => {
    const uid: string = context.params.userId;

    const data = snapshot.data();

    const newRunLog: RunLog = {
      distanceKm: data.distanceKm,
      runDate: data.runDate,
      totalTimeMin: data.totalTimeMin,
    };

    // ? get total statistics reference
    const userRef = db.collection("users").doc(uid);
    const totalStatisticsRef = userRef
      .collection("statistics")
      .doc("totalStatistics");

    //? updating values in statistics docs
    await totalStatisticsRef.update({
      totalDistanceKm: FieldValue.increment(newRunLog.distanceKm),
      totalTimeMin: FieldValue.increment(newRunLog.totalTimeMin),
      totalRunCount: FieldValue.increment(1),
    });
  });
