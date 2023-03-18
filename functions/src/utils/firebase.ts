import admin from "firebase-admin";

const firebase = admin.initializeApp();

const db = admin.firestore();

export { db, firebase };
