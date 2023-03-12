import { Paper, Grid, Typography } from "@mui/material";
interface RunListItemProps {
  runDate: any;
  distanceKm: number;
  totalTimeMin: number;
}

function RunListItem(props: RunListItemProps) {
  const { runDate, distanceKm, totalTimeMin } = props;

  const date = new Date(runDate._seconds * 1000);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return (
    <Paper
      sx={{
        height: "4rem",
        backgroundColor: "rgb(77, 77, 77)",
        // minWidth: "300px",
      }}
    >
      <Grid container sx={{ height: "100%", width: "100%" }}>
        <Grid container xs={3} item sx={{}}>
          <Typography
            sx={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            {day}/{month}/{year}
          </Typography>
        </Grid>

        <Grid item xs={9} sx={{ padding: "0.25rem" }} container>
          <Paper
            sx={{
              background: "rgb(21, 21, 21)",
              width: "100%",
              color: "white",
            }}
          >
            <Grid xs={12} item>
              Distance: {distanceKm} km
            </Grid>
            <Grid xs={12} item>
              total time: {totalTimeMin} min
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default RunListItem;
