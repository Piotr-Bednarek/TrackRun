import { Button, Drawer } from "@mui/material";
import { useState } from "react";

export default function NavigationDrawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Button sx={{ display: open ? "none" : "block" }} onClick={toggleDrawer}>
        OPEN
      </Button>
      <Drawer
        sx={{
          width: "120px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 2,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <div>
          <Button onClick={toggleDrawer}>CLOSE</Button>
          <p>DRAWER STUFF</p>
        </div>
      </Drawer>
    </>
  );
}
