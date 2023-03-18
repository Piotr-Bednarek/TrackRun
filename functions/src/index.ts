import * as functions from "firebase-functions";
const cors = require("cors")({ origin: true });

import { FieldValue } from "firebase-admin/firestore";
import { RunLog } from "./types";

import { handleUserLoginCallable } from "./user/handleUserLoginCallable";
import { handleGetUserTotalStatistics } from "./user/handleGetUserTotalStatistics";
import { handleNewRunCallable } from "./firestore/handleNewRunCallable";

import { handleNumberOfPagesCallable } from "./firestore/handleNumberOfPagesCallable";

export {
  handleUserLoginCallable,
  handleGetUserTotalStatistics,
  handleNewRunCallable,
  handleNumberOfPagesCallable,
};

import { firebaseApp } from "./firebase";

const db = firebaseApp.firestore();

export const getUserData = functions
  .region("europe-west1")
  .https.onRequest((request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET");
    response.set("Access-Control-Allow-Headers", "Content-Type");

    cors(request, response, async () => {
      const uid = request.query.uid?.toString();

      if (!uid) {
        response.status(400).json({ success: false, error: "Missing uid" });
        return;
      }

      functions.logger.info("Requested user data: " + uid, {
        structuredData: true,
      });

      //* get user data from firestore database

      try {
        const userDoc = await db.collection("users").doc(uid).get();

        if (!userDoc.exists) {
          response.status(400).send({
            success: false,
            error: "User does not exist",
          });
          return;
        }
        const userData = userDoc.data();
        response.send({ success: true, userData: userData });
        // const userRef = db.collection("users").doc(uid);
      } catch (error) {
        functions.logger.error(error, { structuredData: true });
      }
    });
  });

export const getUserRunData = functions
  .region("europe-west1")
  .https.onRequest((request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET");
    response.set("Access-Control-Allow-Headers", "Content-Type");

    cors(request, response, async () => {
      const uid = request.query.uid?.toString();

      if (!uid) {
        response.status(400).json({ success: false, error: "Missing uid" });
        return;
      }

      functions.logger.info("Requested user run data: " + uid, {
        structuredData: true,
      });

      //* get user run data from firestore database

      try {
        const userRef = db.collection("users").doc(uid);

        await userRef
          .collection("runs")
          .orderBy("runDate", "desc")
          .get()
          .then((snapshot) => {
            const runData: any = [];
            snapshot.forEach((doc) => {
              runData.push(doc.data());
            });
            response.send({ success: true, runData: runData });
          });
      } catch (error) {
        functions.logger.error(error, { structuredData: true });
      }
    });
  });

//TODO REFACOR ALL ABOVE
//TODO REFACOR ALL ABOVE
//TODO REFACOR ALL ABOVE
//TODO REFACOR ALL ABOVE
//TODO REFACOR ALL ABOVE

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
