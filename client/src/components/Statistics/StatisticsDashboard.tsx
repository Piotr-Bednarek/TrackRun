import { Paper, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { functions } from "../../firebase/firebase";
import { useUserTotalStatistics } from "../../hooks/useUserStatistics";
import { StatisticsItem } from "./StatisticsItem";
import WeeklyStatisticsDashboard from "./WeeklyStatisticsDashboard";

export default function StatisticsDashboard() {
  const { userId: uid } = useParams();

  if (!uid) return <p>No user id</p>;
  const { userTotalStatistics, isLoading, error } = useUserTotalStatistics(uid);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Stack
      direction="column"
      alignItems="stretch"
      spacing={2}
      sx={{
        // backgroundColor: "dodgerblue",
        height: "100%",
        width: "100%",
      }}
    >
      <Paper
        sx={{
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(77, 77, 77)",
        }}
      >
        <Typography color={"white"} variant="h4">
          Your statistics
        </Typography>
      </Paper>

      <StatisticsItem
        title="total distance"
        unit="km"
        value={userTotalStatistics?.totalDistanceKm}
      />
      <StatisticsItem
        title="total time"
        unit="min"
        value={userTotalStatistics?.totalTimeMin}
      />
      <StatisticsItem
        title="total runs"
        unit=""
        value={userTotalStatistics?.totalRunCount}
      />

      <WeeklyStatisticsDashboard />
    </Stack>
  );
}
