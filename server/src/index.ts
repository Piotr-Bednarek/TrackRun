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
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.post("/api/login", (req, res) => {
  const data = req.body;
  console.log(data);
  res.send("Hello World!");
});

app.post("/api/test", (req, res) => {
  const data: Interface.Data = req.body;

  getUidFromToken(data.idToken)
    .then((uid) => {
      console.log(uid);
      addUserToDatabase(uid);
      res.json({ success: true, uid: uid });
    })
    .catch((error) => {
      console.log(error);
    });
});

const addUserToDatabase = (uid: any) => {
  const userRef = db.collection("users").doc(uid);
  const runRef = db.collection("users").doc(uid).collection("runs").doc();

  const run: Interface.Run = {
    runId: runRef.id,
  };

  userRef.collection("runs").doc(run.runId).set(run);
};

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
