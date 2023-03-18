import { Timestamp } from "firebase-admin/firestore";

export type RunLog = {
  distanceKm: number;
  runDate: Timestamp;
  totalTimeMin: number;
};
