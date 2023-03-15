import * as functions from "firebase-functions";
const cors = require("cors")({ origin: true });

import admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

import { FieldValue, Timestamp } from "firebase-admin/firestore";

// const corsOptions = {
//   origin: true,
//   methods: ["GET"],
//   allowedHeaders: ["Content-Type"],
// };

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
          .orderBy("runDate.seconds", "desc")
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

const addUserToDatabaseIfNotExists = async (uid: string) => {
  const userRef = db.collection("users").doc(uid);

  const snapshot = await userRef.get();

  if (snapshot.exists) {
    console.log("User already exists", uid);
    return;
  } else {
    const user = await admin.auth().getUser(uid);

    //? create new user in database
    await userRef.create({
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.metadata.creationTime,
    });

    // ? create statistics collection for user
    const statisticsRef = userRef.collection("statistics");
    await statisticsRef.doc("totalStatistics").create({});

    console.log("Successfully added new user to database: ", uid);
  }
};

export const handleUserLoginCallable = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const idToken: string = data.idToken;

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    await addUserToDatabaseIfNotExists(uid);

    return { success: true, uid: uid };
  });

export const handleNewRunCallable = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    try {
      const uid: string = data.uid;
      const runData = { ...data.runData };

      const userRef = db.collection("users").doc(uid);
      const runsRef = userRef.collection("runs");

      const runRef = runsRef.doc();
      await runRef.set(runData);

      return { success: true, runId: runRef.id };
    } catch (error) {
      console.error("Error adding run to database: ", error);
      return { success: false, error: error };
    }
  });

//- UPDATE TOTAL STATISTICS ON NEW RUN

type RunLog = {
  distanceKm: number;
  runDate: Timestamp;
  totalTimeMin: number;
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

//- GET USER'S STATISTICS

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
