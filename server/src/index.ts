import * as Interface from "./models/Interfaces";

import express from "express";

// import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

import { getAuth } from "firebase-admin/auth";

import { getUidFromToken } from "./utils/authenticateUser";

import admin from "firebase-admin";
const serviceAccount = require("./serviceAccountKey.json");

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

  getUidFromToken(data.idToken)
    .then((uid) => {
      console.log(uid);
      res.json({ success: true, uid: uid });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
