import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

interface Props {
  open: boolean;
  toggleDialog: (open: boolean) => void;
}

export default function FormDialog(props: Props) {
  const { open, toggleDialog } = props;

  const handleSubmit = () => {
    console.log(distanceKm, timeHours, timeMinutes);
    toggleDialog(false);

    updateDistanceKm(0);
    updateTimeMinutes(0);
    updateTimeMinutes(0);
  };

  const [distanceKm, updateDistanceKm] = useState<number>();
  const [timeHours, updateTimeHours] = useState<number>();
  const [timeMinutes, updateTimeMinutes] = useState<number>();

  const [averagePace, updateAveragePace] = useState<number>();

  const calculateAveragePace = (
    distance_km: any,
    time_hours: any,
    time_minutes: any
  ) => {
    if (!distance_km) {
      return;
    }
    if (!time_hours && !time_minutes) {
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
    console.log("minutes: ", minutes);
    console.log("pace: ", paceMinPerKm);
    updateAveragePace(paceMinPerKm);
  };

  const updateDistnaceKmInput = (value: string) => {
    updateDistanceKm(Number(value));
    calculateAveragePace(Number(value), timeHours, timeMinutes);
  };

  const updateTimeHoursInput = (value: string) => {
    updateTimeHours(Number(value));
    calculateAveragePace(distanceKm, Number(value), timeMinutes);
  };

  const updateTimeMinutesInput = (value: string) => {
    updateTimeMinutes(Number(value));
    calculateAveragePace(distanceKm, timeHours, Number(value));
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
          type="number"
          fullWidth
          value={distanceKm || ""}
          onChange={(e) => updateDistnaceKmInput(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="distance"
          label="Time (hours)"
          type="number"
          fullWidth
          value={timeHours || ""}
          onChange={(e) => updateTimeHoursInput(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="distance"
          label="Time (minutes)"
          type="number"
          fullWidth
          value={timeMinutes || ""}
          onChange={(e) => updateTimeMinutesInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
