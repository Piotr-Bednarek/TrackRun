import { Pagination, Typography } from "@mui/material";
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
    <div>
      <p>pages {numberOfPages}</p>
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
    </div>
  );
}
