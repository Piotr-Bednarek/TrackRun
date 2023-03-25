import React from "react";

interface RunListContextProps {
  addNewRun: (runData: any) => void;
}

const RunListContext = React.createContext<RunListContextProps>({
  addNewRun: () => {},
});

export default RunListContext;
