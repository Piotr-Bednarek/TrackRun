import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Button, Paper, Stack, Typography } from "@mui/material";

import RunListItem from "./RunListItem";
import FormDialog from "./FormDialog";

import RunListContext from "../../contexts/RunListContext";
import PaginationContext from "../../contexts/PaginationContext";

import PagesComponent from "./PaginationComponent";

import { functions } from "../../firebase/firebase";
import { httpsCallable } from "firebase/functions";

type Result = {
  success: boolean;
  numberOfPages?: number;
};

function RunList() {
  const { userId: uid } = useParams();

  const [userRunData, setUserRunData] = useState<any>(null);

  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const [numberOfPages, setNumberOfPages] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);

  const handleNumberOfPagesCallable = httpsCallable(
    functions,
    "handleNumberOfPagesCallable"
  );

  const getNumberOfPages = async () => {
    const result = await handleNumberOfPagesCallable({ uid });

    const data = result.data as Result;

    setNumberOfPages(data.numberOfPages || 0);
  };

  const toggleDialog = () => {
    setFormDialogOpen(!formDialogOpen);
  };

  useEffect(() => {
    if (!uid) {
      console.log("No uid");
      return;
    }

    fetchUserRunData();
    getNumberOfPages();
  }, []);

  const addNewRun = (runData: any) => {
    console.log(runData);

    setUserRunData((prevRunData: any) => {
      return [runData, ...prevRunData];
    });
  };

  const handlePageChange = (page: number) => {
    setSelectedPage(page);
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

      console.log(response);

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
      <PaginationContext.Provider
        value={{ numberOfPages, selectedPage, handlePageChange }}
      >
        <PagesComponent />
      </PaginationContext.Provider>
    </Stack>
  );
}

export default RunList;
