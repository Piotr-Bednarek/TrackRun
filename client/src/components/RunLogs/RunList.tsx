import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Button, Paper, Stack, Typography } from "@mui/material";
import RunListItem from "./RunListItem";
import FormDialog from "./FormDialog";
import RunListContext from "../../contexts/RunListContext";

function RunList() {
  const { userUid: uid } = useParams();

  const [userRunData, setUserRunData] = useState<any>(null);

  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const toggleDialog = () => {
    setFormDialogOpen(!formDialogOpen);
  };

  useEffect(() => {
    if (!uid) {
      console.log("No uid");
      return;
    }

    fetchUserRunData();
  }, []);

  const addNewRun = (runData: any) => {
    console.log(runData);

    setUserRunData((prevRunData: any) => {
      return [runData, ...prevRunData];
    });
  };

  const fetchUserRunData = async () => {
    try {
      const url = `http://127.0.0.1:5001/track-run-b9950/europe-west1/getUserRunData?uid=${uid}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(url, options);

      const result = await response.json();

      console.log(result.runData);

      setUserRunData(result.runData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
      sx={{ height: "100%", width: "100%" }}
    >
      <Paper>
        <Typography variant="h5" component="h2">
          Run List
        </Typography>
        <Button onClick={toggleDialog}>ADD</Button>
        <RunListContext.Provider value={{ addNewRun }}>
          <FormDialog
            uid={uid || ""}
            open={formDialogOpen}
            toggleDialog={toggleDialog}
          />
        </RunListContext.Provider>
      </Paper>
      {userRunData && userRunData.length > 0 ? (
        userRunData.map((run: any, idx: number) => (
          <RunListItem
            key={idx}
            runDate={run.runDate}
            distanceKm={run.distanceKm}
            totalTimeMin={run.totalTimeMin}
          />
        ))
      ) : (
        <div>No runs</div>
      )}
    </Stack>
  );
}

export default RunList;
