import { Paper, Box, Typography } from "@mui/material";

type StatisticsItemProps = {
  title: string;
  value: number | undefined;
  unit: string;
};

export const StatisticsItem = ({ title, value, unit }: StatisticsItemProps) => {
  return (
    <Paper
      sx={{
        height: "4rem",
        backgroundColor: "rgb(77, 77, 77)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "50%",
          height: "100%",
          // backgroundColor: "green",
          border: "1px solid white",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Typography>{title}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "50%",
          height: "100%",
          // backgroundColor: "blue",
          border: "1px solid white",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Typography fontSize={"1.5rem"}>
          {value} {unit}
        </Typography>
      </Box>
    </Paper>
  );
};
