import React from "react";

interface PaginationContextProps {
  numberOfPages: number;
  selectedPage: number;
  handlePageChange: (page: number) => void;
}

const PaginationContext = React.createContext<PaginationContextProps>({
  numberOfPages: 0,
  selectedPage: 0,
  handlePageChange: () => {},
});

export default PaginationContext;
