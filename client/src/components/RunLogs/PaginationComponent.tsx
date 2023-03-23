import { Box, Pagination, Typography } from "@mui/material";
import { useContext } from "react";
import PaginationContext from "../../contexts/PaginationContext";

export default function PaginationComponent() {
  const { numberOfPages, selectedPage, handlePageChange } =
    useContext(PaginationContext);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    handlePageChange(value);
    console.log(value);
  };

  return (
    <Box
      sx={{
        background: "dodgerblue",
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
        left: 0,
      }}
    >
      <Pagination
        sx={{
          "& .MuiPaginationItem-root": {
            color: "white",
          },
        }}
        size="large"
        count={numberOfPages}
        onChange={handleChange}
      />
    </Box>
  );
}
