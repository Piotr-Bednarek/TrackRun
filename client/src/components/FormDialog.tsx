import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { httpsCallable } from "firebase/functions";
import { useContext, useState } from "react";
import { functions } from "../firebase/firebase";

import RunListContext from "../contexts/RunListContext";

import { db } from "../firebase/firebase";
import { Timestamp } from "firebase/firestore";

interface Props {
  uid: string;
  open: boolean;
  toggleDialog: (open: boolean) => void;
}

export default function FormDialog(props: Props) {
  const { uid, open, toggleDialog } = props;

  const { addNewRun } = useContext(RunListContext);

  const handleSubmit = () => {
    if (!distanceKm) {
      setDistanceError(true);
      setDistanceErrorText("Please enter a distance");
      return;
    }

    if (!timeHours && !timeMinutes) {
      setTimeHoursError(true);
      setTimeHoursErrorText("Please enter a time");
      setTimeMinutesError(true);
      setTimeMinutesErrorText("Please enter a time");
      return;
    }

    // console.log(distanceKm, timeHours, timeMinutes);

    handleLogNewRun();

    cleanUp();
  };

  const handleNewRun = httpsCallable(functions, "handleNewRunCallable");

  const handleLogNewRun = async () => {
    console.log("handleLogNewRun called");
    console.log("uid: ", uid);

    const totalTimeInMinutes =
      (parseInt(timeHours || "0") ?? 0) * 60 +
      (parseInt(timeMinutes || "0") ?? 0);

    console.log("totalTimeInMinutes: ", totalTimeInMinutes);

    const timestamp = Timestamp.now();
    console.log("timestamp: ", timestamp);

    const runData = {
      runDate: timestamp,
      distanceKm: parseFloat(distanceKm),
      totalTimeMin: totalTimeInMinutes,
    };

    addNewRun(runData);

    try {
      const response = await handleNewRun({
        uid: uid,
        runData,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const cleanUp = () => {
    toggleDialog(false);

    updateDistanceKm("");
    updateTimeHours("");
    updateTimeMinutes("");

    setDistanceError(false);
    setDistanceErrorText("");
    setTimeHoursError(false);
    setTimeHoursErrorText("");
    setTimeMinutesError(false);
    setTimeMinutesErrorText("");
  };

  const [distanceKm, updateDistanceKm] = useState<string>("");
  const [timeHours, updateTimeHours] = useState<string>("");
  const [timeMinutes, updateTimeMinutes] = useState<string>("");
  const [averagePace, updateAveragePace] = useState<number>();

  const [distanceError, setDistanceError] = useState(false);
  const [distnaceErrorText, setDistanceErrorText] = useState<string>("");

  const [timeHoursError, setTimeHoursError] = useState(false);
  const [timeHoursErrorText, setTimeHoursErrorText] = useState<string>("");

  const [timeMinutesError, setTimeMinutesError] = useState(false);
  const [timeMinutesErrorText, setTimeMinutesErrorText] = useState<string>("");

  const calculateAveragePace = (
    distance_km: any,
    time_hours: any,
    time_minutes: any
  ) => {
    if (!distance_km) {
      updateAveragePace(0);
      return;
    }
    if (!time_hours && !time_minutes) {
      updateAveragePace(0);
      return;
    }

    //calculate average pace
    let minutes = 0;

    if (!time_hours) {
      minutes = time_minutes;
    } else if (!time_minutes) {
      minutes = time_hours * 60;
    } else {
      minutes = time_hours * 60 + time_minutes;
    }

    const paceMinPerKm = minutes / distance_km;
    // console.log("minutes: ", minutes);
    // console.log("pace: ", paceMinPerKm);
    updateAveragePace(paceMinPerKm);
  };

  const updateDistanceKmInput = (value: string) => {
    if (distanceError) {
      setDistanceError(false);
      setDistanceErrorText("");
    }
    // console.log("value: ", value);
    updateDistanceKm(value);
    // if (!value.endsWith(".")) {
    calculateAveragePace(parseFloat(value), timeHours, timeMinutes);
    // }
  };

  const updateTimeHoursInput = (value: string) => {
    if (timeHoursError) {
      setTimeHoursError(false);
      setTimeHoursErrorText("");
    }

    // console.log("value: ", value);
    updateTimeHours(value);
    calculateAveragePace(distanceKm, parseFloat(value), timeMinutes);
  };

  const updateTimeMinutesInput = (value: string) => {
    if (timeMinutesError) {
      setTimeMinutesError(false);
      setTimeMinutesErrorText("");
    }

    // console.log("value: ", value);
    updateTimeMinutes(value);
    calculateAveragePace(distanceKm, timeHours, parseFloat(value));
  };

  return (
    <Dialog open={open} onClose={toggleDialog}>
      <DialogTitle>Enter your run data:</DialogTitle>
      <DialogContent>
        <DialogContentText>Make sure your data is correct</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="distance"
          label="Distance (km)"
          type="text"
          fullWidth
          value={distanceKm || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d{0,1}$/.test(value) || value === "") {
              updateDistanceKmInput(value);
            }
          }}
          error={distanceError}
          helperText={distanceError ? distnaceErrorText : ""}
        />
        <TextField
          autoFocus
          margin="dense"
          id="distance"
          label="Time (hours)"
          type="text"
          fullWidth
          value={timeHours || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[1-9]\d*$/.test(value) || value === "") {
              updateTimeHoursInput(value);
            }
          }}
          error={timeHoursError}
          helperText={timeHoursError ? timeHoursErrorText : ""}
        />
        <TextField
          autoFocus
          margin="dense"
          id="distance"
          label="Time (minutes)"
          type="text"
          fullWidth
          value={timeMinutes || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[1-9]\d*$/.test(value) || value === "") {
              updateTimeMinutesInput(value);
            }
          }}
          error={timeMinutesError}
          helperText={timeMinutesError ? timeMinutesErrorText : ""}
        />
        avg pace: {averagePace} min/km
        <br />
        distnace: {distanceKm}
        <br />
        timeHours: {timeHours}
        <br />
        timeMinutes: {timeMinutes}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
