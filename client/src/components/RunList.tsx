import { Stack } from "@mui/material";
import RunListItem from "./RunListItem";

function RunList() {
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
      sx={{ height: "100%", width: "100%" }}
    >
      <RunListItem />
    </Stack>
  );
}

export default RunList;
