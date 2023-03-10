import { Paper, Grid } from "@mui/material";

function RunListItem() {
  return (
    <Paper sx={{ height: "4rem", backgroundColor: "rgb(77, 77, 77)" }}>
      <Grid container sx={{ height: "100%", width: "100%" }}>
        <Grid xs={3} item sx={{ background: "red" }}>
          RUNDATE
        </Grid>
        <Grid item xs={9} sx={{ background: "dodgerblue" }} container>
          <Grid xs={12} item>
            DISTANCE
          </Grid>
          <Grid xs={12} item>
            AVG PACE
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default RunListItem;
