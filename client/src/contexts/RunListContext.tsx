import React from "react";

interface RunListContextProps {
  // runData: any;
  addNewRun: (runData: any) => void;
}

const RunListContext = React.createContext<RunListContextProps>({
  // runData: [],
  addNewRun: () => {},
});

export default RunListContext;
