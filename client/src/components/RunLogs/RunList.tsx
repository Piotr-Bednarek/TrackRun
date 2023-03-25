import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";

import FormDialog from "./FormDialog";
import RunListItem from "./RunListItem";

import PaginationContext from "../../contexts/PaginationContext";
import RunListContext from "../../contexts/RunListContext";

import PaginationComponent from "./PaginationComponent";

import { useNumberOfPages } from "../../hooks/useNumberOfPages";
import { useUserRunData } from "../../hooks/useUserRunData";

import { RunData } from "../../types";

function RunList() {
  const { userId: uid } = useParams();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);

  if (!uid) return <p>No user id</p>;

  const {
    userRunData,
    isLoading: userRunDataIsLoading,
    error: userRunDataError,
    updateUserRunData,
  } = useUserRunData(uid, selectedPage);

  const {
    numberOfPages,
    isLoading: numberOfPagesIsLoading,
    error: numberOfPagesError,
    updateNumberOfPages,
  } = useNumberOfPages(uid);

  const toggleDialog = () => {
    setFormDialogOpen(!formDialogOpen);
  };

  useEffect(() => {
    if (!uid) {
      console.log("No uid");
      return;
    }
  }, [selectedPage]);

  const addNewRun = (runData: any) => {
    updateUserRunData(runData);
    updateNumberOfPages();
  };

  const handlePageChange = (page: number) => {
    setSelectedPage(page);
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
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          gap={2}
          sx={{ height: "4rem" }}
        >
          <Grid item xs={3} sx={{ height: "100%" }}>
            <Paper
              elevation={24}
              sx={{
                background: "rgb(30, 30, 30)",
                height: "100%",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // borderRadius: "0.5rem",
                border: "1px solid rgb(77, 77, 77)",
                boxSizing: "border-box",
              }}
            >
              <Typography variant="h5" component="h2">
                Run List
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={toggleDialog}>ADD</Button>
            <RunListContext.Provider
              value={{
                addNewRun,
              }}
            >
              <FormDialog
                uid={uid || ""}
                open={formDialogOpen}
                toggleDialog={toggleDialog}
              />
            </RunListContext.Provider>
          </Grid>
        </Grid>
        <Box sx={{ flex: 1, paddingTop: "0.5rem" }}>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={1}
            sx={{ width: "100%", height: "100%" }}
          >
            {userRunDataIsLoading ? (
              <div>Loading...</div>
            ) : userRunData?.length === 0 ? (
              <div>No data</div>
            ) : (
              userRunData &&
              userRunData.map((run: any, idx: number) => (
                <RunListItem
                  key={idx}
                  runDate={run.runDate}
                  distanceKm={run.distanceKm}
                  totalTimeMin={run.totalTimeMin}
                />
              ))
            )}
          </Stack>
        </Box>
        {numberOfPagesIsLoading && <div>Loading...</div>}
        {numberOfPages && (
          <PaginationContext.Provider
            value={{ numberOfPages, selectedPage, handlePageChange }}
          >
            <PaginationComponent />
          </PaginationContext.Provider>
        )}
      </Box>
    </Box>
  );
}

export default RunList;
