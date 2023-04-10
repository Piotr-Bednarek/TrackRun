import React from "react";

interface NavigationDrawerContextProps {
  headerHeight: number;
}

const NavigationDrawerContext =
  React.createContext<NavigationDrawerContextProps>({
    headerHeight: 0,
  });

export default NavigationDrawerContext;
