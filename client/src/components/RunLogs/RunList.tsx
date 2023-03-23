import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import RunListItem from "./RunListItem";
import FormDialog from "./FormDialog";

import RunListContext from "../../contexts/RunListContext";
import PaginationContext from "../../contexts/PaginationContext";

import PaginationComponent from "./PaginationComponent";

import { functions } from "../../firebase/firebase";
import { httpsCallable } from "firebase/functions";

type FetchNumberOfPagesResult = {
  success: boolean;
  numberOfPages?: number;
};

type FetchUserRunDataResult = {
  success: boolean;
  runData?: [];
};

function RunList() {
  const { userId: uid } = useParams();

  const [userRunData, setUserRunData] = useState<any>(null);

  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const [numberOfPages, setNumberOfPages] = useState(1);
  const [selectedPage, setSelectedPage] = useState(1);
  const [lastRun, setLastRun] = useState<any>(null);

  const handleNumberOfPagesCallable = httpsCallable(
    functions,
    "handleNumberOfPagesCallable"
  );

  const handleFetchUserRunDataCallable = httpsCallable(
    functions,
    "handleFetchUserRunDataCallable"
  );

  const getNumberOfPages = async () => {
    const result = await handleNumberOfPagesCallable({ uid });

    const data = result.data as FetchNumberOfPagesResult;

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
  }, [selectedPage]);

  const addNewRun = (runData: any) => {
    console.log(runData);

    setUserRunData((prevRunData: any) => {
      if (!Array.isArray(prevRunData)) {
        return [runData];
      }
      return [runData, ...prevRunData];
    });
  };

  const handlePageChange = (page: number) => {
    setSelectedPage(page);
  };

  const fetchUserRunData = async () => {
    const result = await handleFetchUserRunDataCallable({
      uid,
      selectedPage,
      lastRun,
    });

    const data = result.data as FetchUserRunDataResult;
    const runData = data.runData || [];

    setUserRunData(runData);

    console.log(runData);
    console.log(runData[runData.length - 1]);
    console.log(selectedPage);

    setLastRun(runData[runData.length - 1]);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          background: "green",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
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
        <Box sx={{ backgroundColor: "red", flex: 1, paddingTop: "0.5rem" }}>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={1}
            sx={{ width: "100%", height: "100%" }}
          >
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
        </Box>
        <PaginationContext.Provider
          value={{ numberOfPages, selectedPage, handlePageChange }}
        >
          <PaginationComponent />
        </PaginationContext.Provider>
      </Box>
    </Box>
  );
}

export default RunList;
