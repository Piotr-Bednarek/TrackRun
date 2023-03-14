import { Card, Typography } from "@mui/material";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Link } from "react-router-dom";

interface DrawerButtonProps {
  route: string;
  icon: JSX.Element;
  text: string;
  open: boolean;
}

function DrawerButton({ route, icon, text, open }: DrawerButtonProps) {
  const cardStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    gap: "1rem",
    userSelect: "none",

    background: "rgb(59, 59, 59)",
    color: "white",
    height: "2.5rem",
    cursor: "pointer",
    transition: "transform 0.2s",
    "&:hover": {
      background: "rgb(89, 89, 89)",
      transform: "scale(1.05)",
    },
    "&:active": {
      background: "rgb(37, 37, 37)",
      transform: "scale(1)",
    },
  };

  return (
    <Link to={{ hash: route }} style={{ textDecoration: "none" }}>
      <Card
        onClick={() => {
          console.log(route);
        }}
        sx={cardStyle}
      >
        {/* <FormatListNumberedIcon /> */}
        {icon}

        {open ? (
          <div style={{ flexGrow: 1 }}>
            <Typography textAlign={"center"}>{text}</Typography>
          </div>
        ) : null}
      </Card>
    </Link>
  );
}

export default DrawerButton;
