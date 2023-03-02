import * as Interface from "./Interfaces";

import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

import { applicationDefault, initializeApp } from "firebase-admin/app";

// import serviceAccount from "./serviceAccountKey.json";

import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = require("./serviceAccountKey.json");

// import serviceAccount from "../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/api/login", (req, res) => {
  const data = req.body;
  console.log(data);
  res.send("Hello World!");
});

app.post("/api/test", (req, res) => {
  const data: Interface.Data = req.body;

  getAuth()
    .verifyIdToken(data.idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      console.log(uid);
    })
    .catch((error) => {
      console.log(error);
    });

  res.send("Succes!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
