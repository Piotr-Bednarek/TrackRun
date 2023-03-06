import React from "react";

interface HeaderContextProps {
  displayName: string;
  photoURL: string;
}

const HeaderContext = React.createContext<HeaderContextProps>({
  displayName: "",
  photoURL: "",
});
export default HeaderContext;
