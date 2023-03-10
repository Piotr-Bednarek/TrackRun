import { useState } from "react";
import DrawerButton from "./DrawerButton";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ViewListIcon from "@mui/icons-material/ViewList";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SettingsIcon from "@mui/icons-material/Settings";

import { Drawer, Box, IconButton, Stack } from "@mui/material";

interface NavigationDrawerProps {
  widthOpen: string;
  widthClosed: string;
  open: boolean;
  toggleDrawer: () => void;
}

function NavigationDrawer({
  widthOpen,
  widthClosed,
  open,
  toggleDrawer,
}: NavigationDrawerProps) {
  const headerHeight = "4rem";

  const iconStyle = {
    alignItems: "center",
    justifyContent: "center",
    height: "50px",
    width: "50px",
  };

  return (
    <Drawer
      transitionDuration={2000}
      sx={{
        height: "100%",
        width: open ? widthOpen : widthClosed,

        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? widthOpen : widthClosed,
          height: "100%",
          marginTop: headerHeight,
          border: "none",
          borderRight: "2px solid rgb(77, 77, 77)",
        },
      }}
      variant="permanent"
      anchor="left"
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          background: "rgb(59, 59, 59)",
          width: "100%",
          height: "100%",
        }}
      >
        {open ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              sx={{
                iconStyle,
                display: open ? "flex" : "none",
                color: "white",
              }}
              onClick={toggleDrawer}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              sx={{
                iconStyle,
                display: open ? "none" : "flex",
                color: "white",
              }}
              onClick={toggleDrawer}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        )}
        <Box
          sx={{
            borderTop: "2px solid rgb(77, 77, 77)",

            background: "rgb(21, 21, 21)",
            flexGrow: 1,
            display: "flex",
            color: "white",
            justifyContent: "center",
          }}
        >
          <Stack
            sx={{ width: "100%" }}
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={1}
            p={1.5}
          >
            {drawerButtons.map((button, index) => (
              <DrawerButton
                key={index}
                route={button.route}
                icon={button.icon}
                text={button.text}
                open={open}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}

export default NavigationDrawer;

const drawerButtons = [
  {
    route: "#logs",
    icon: <ViewListIcon />,
    text: "Logs",
  },
  {
    route: "#stats",
    icon: <ShowChartIcon />,
    text: "Stats",
  },
  {
    route: "#settings",
    icon: <SettingsIcon />,
    text: "Settings",
  },
];
