import { AppBar, Box, SvgIcon, Typography, Avatar } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";

import HeaderContext from "../contexts/HeaderContext";

interface UserPageAppBarProps {
  height: string;
}

function UserPageAppBar({ height }: UserPageAppBarProps) {
  const { photoURL, displayName, isOwnProfile } = useContext(HeaderContext);

  const iconPath =
    "M320 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM125.7 175.5c9.9-9.9 23.4-15.5 37.5-15.5c1.9 0 3.8 .1 5.6 .3L137.6 254c-9.3 28 1.7 58.8 26.8 74.5l86.2 53.9-25.4 88.8c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l28.7-100.4c5.9-20.6-2.6-42.6-20.7-53.9L238 299l30.9-82.4 5.1 12.3C289 264.7 323.9 288 362.7 288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H362.7c-12.9 0-24.6-7.8-29.5-19.7l-6.3-15c-14.6-35.1-44.1-61.9-80.5-73.1l-48.7-15c-11.1-3.4-22.7-5.2-34.4-5.2c-31 0-60.8 12.3-82.7 34.3L57.4 153.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l23.1-23.1zM91.2 352H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h69.6c19 0 36.2-11.2 43.9-28.5L157 361.6l-9.5-6c-17.5-10.9-30.5-26.8-37.9-44.9L91.2 352z";

  return (
    <AppBar
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: height,
        boxSizing: "border-box",
        borderBottom: "2px solid rgb(77, 77, 77)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          backgroundColor: "rgb(21, 21, 21)",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          flexGrow: 1,
          px: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link to="/">
            <SvgIcon
              fontSize="large"
              sx={{ fill: "white", mr: 2 }}
              viewBox="0 0 512 512"
            >
              <path d={iconPath} />
            </SvgIcon>
          </Link>
          <Typography
            sx={{
              fontWeight: "bold",
              fontStyle: "italic",
              fontSize: "1.5rem",
            }}
          >
            TrackRun
          </Typography>
        </Box>
        {isOwnProfile && <Typography>Own Profile</Typography>}
        {displayName}
        <Avatar
          src={photoURL}
          sx={{
            width: "calc(headerHeight - 0.5rem)",
            height: "calc(headerHeight - 0.5rem)",
          }}
        />
      </Box>
    </AppBar>
  );
}

export default UserPageAppBar;
