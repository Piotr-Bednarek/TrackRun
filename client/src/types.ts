import { Timestamp } from "firebase/firestore";

export type RunData = {
  distanceKm: number;
  totalTimeMin: number;
  runDate: Timestamp;
};
