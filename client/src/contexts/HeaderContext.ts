import React from "react";

interface HeaderContextProps {
  displayName: string;
  photoURL: string;
  isOwnProfile: boolean;
}

const HeaderContext = React.createContext<HeaderContextProps>({
  displayName: "",
  photoURL: "",
  isOwnProfile: false,
});
export default HeaderContext;
