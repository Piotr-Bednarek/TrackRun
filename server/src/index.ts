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
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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
    });
});

const addUserToDatabase = async (uid: any) => {
  const userRef = db.collection("users").doc(uid);

  const snapshot = await userRef.get();

  if (snapshot.exists) {
    console.log("User already exists in database: ", uid);
  } else {
    const user = await getAuth().getUser(uid);

    await userRef.create({
      // uid: uid,
      // email: user.email,
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
