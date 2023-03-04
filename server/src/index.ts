import * as Interface from "./models/Interfaces";

import express from "express";

import dotenv from "dotenv";

import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

import { getUidFromToken } from "./utils/authenticateUser";

import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

app.post("/api/login", (req, res) => {
  const idToken: string = req.body.idToken;

  getUidFromToken(idToken)
    .then((uid) => {
      // console.log(uid);
      addUserToDatabase(uid);
      res.json({ success: true, uid: uid });
    })
    .catch((error) => {
      console.log(error);
      console.log("error");
    });
});

app.get("/api/get-user-data", (req, res) => {
  const uid: string = req.query.uid as string;
  // console.log(uid);

  // if (!uid) {
  //   res.status(400).json({ success: false, error: "Missing uid" });
  //   return;
  // }

  const userRef = db.collection("users").doc(uid);

  userRef
    .collection("runs")
    .orderBy("runDate", "desc")
    .get()
    .then((snapshot) => {
      const runsData: any = [];
      snapshot.forEach((doc) => {
        runsData.push(doc.data());
      });
      res.json({ success: true, runsData: runsData });
    })
    .catch((error) => {
      console.log(error);
      console.log("error");
    });
});

app.post("/api/create-new-run", (req, res) => {
  //get runData from request
  const data = req.body;
  // console.log(data.uid);

  if (!data.runDistanceKm || !data.runAveragePace || !data.runDate) {
    res.status(400).json({ success: false, error: "Missing run data" });
    return;
  }

  // check if runs subcollection exists in user document

  const newRunData: Interface.Run = {
    runDistanceKm: data.runDistanceKm,
    runAveragePace: data.runAveragePace,
    runDate: data.runDate,
  };

  addNewRunToDatabase(data.uid, newRunData);

  // console.log("runData: ", data);
  // console.log("runsRef: ", runsRef);
});

const addNewRunToDatabase = async (uid: string, runData: any) => {
  const userRef = db.collection("users").doc(uid);

  const runsRef = userRef.collection("runs");

  // const snapshot = await runsRef.get();

  // if (snapshot.exists) {
  //   console.log("No matching documents.");
  //   return;
  // }

  // snapshot.forEach((doc) => {
  //   console.log(doc.id, "=>", doc.data());
  // });

  const newRunRef = runsRef.doc();

  await newRunRef.create(runData);

  console.log("Successfully added new run to database: ", newRunRef.id);
};

const addUserToDatabase = async (uid: any) => {
  const userRef = db.collection("users").doc(uid);

  const snapshot = await userRef.get();

  if (snapshot.exists) {
    console.log("User already exists in database: ", uid);
  } else {
    const user = await getAuth().getUser(uid);

    await userRef.create({
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.metadata.creationTime,
    });
    console.log("Successfully added user to database: ", uid);
  }
};

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
