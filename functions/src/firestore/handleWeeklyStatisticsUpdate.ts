import * as functions from "firebase-functions";
import { db } from "../utils/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { RunLog } from "../types";

export const handleWeeklyStatisticsUpdate = functions
  .region("europe-west1")
  .firestore.document("users/{userId}/runs/{runId}")
  .onCreate(async (snapshot, context) => {
    const uid: string = context.params.userId;

    const data = snapshot.data();

    const newRunLog: RunLog = {
      runDate: data.runDate,
      distanceKm: data.distanceKm,
      totalTimeMin: data.totalTimeMin,
    };

    //? get year and week number
    const runDate = newRunLog.runDate.toDate();
    const year = runDate.getFullYear();

    const weekNumber = getWeekNumber(runDate);

    // console.log("year: ", year);
    // console.log("weekNumber: ", weekNumber);

    //? get weekly statistics reference
    const userRef = db.collection("users").doc(uid);
    const weeklyStatisticsRef = userRef
      .collection("statistics")
      .doc("weeklyStatistics");

    const yearCollectionRef = weeklyStatisticsRef.collection(year.toString());

    const weekDocRef = yearCollectionRef.doc(weekNumber.toString());

    //? check if week doc exists
    const weekDocSnapshot = await weekDocRef.get();

    if (weekDocSnapshot.exists) {
      //? update week doc
      await weekDocRef.update({
        totalDistanceKm: FieldValue.increment(newRunLog.distanceKm),
        totalTimeMin: FieldValue.increment(newRunLog.totalTimeMin),
        totalRunCount: FieldValue.increment(1),
      });
    } else {
      //? create new week doc
      await weekDocRef.set({
        totalDistanceKm: newRunLog.distanceKm,
        totalTimeMin: newRunLog.totalTimeMin,
        totalRunCount: 1,
      });
    }
  });

const getWeekNumber = (d: Date) => {
  const date: any = new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  );

  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

  const yearStart: any = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  const weekNumber = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);

  return weekNumber;
};
