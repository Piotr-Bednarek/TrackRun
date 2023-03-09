import { useParams, useNavigate, useLocation } from "react-router-dom";

import { logOut, auth } from "../firebase/firebase";

import { useState, useEffect } from "react";
import { browserLocalPersistence } from "firebase/auth";
import Header from "../components/UserPage/Header/Header";

import "./index.css";
import styles from "./UserPage.module.css";

import HeaderContext from "../contexts/HeaderContext";
import Dashboard from "../components/UserPage/Dashboard/Dashboard";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Container, height, maxHeight } from "@mui/system";
import SvgIcon from "@mui/material/SvgIcon";
import Navbar from "../Navbar";
import NavigationDrawer from "../components/UserPage/Header/NavigationDrawer";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function UserPage() {
  const { userUid: uid } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [distanceKm, updateDistanceKm] = useState<number>();
  const [timeHours, updateTimeHours] = useState<number>();
  const [timeMinutes, updateTimeMinutes] = useState<number>();

  const [averagePace, updateAveragePace] = useState<number>();

  const [userRunData, setUserRunData] = useState<any>(null);

  const navigate = useNavigate();

  const { hash } = useLocation();

  useEffect(() => {
    console.log(hash);
  }, [hash]);

  useEffect(() => {
    if (!uid) {
      console.log("No uid");
      return;
    }

    checkIfOwnProfile(uid);
    fetchUserData();
    fetchUserRunData();
  }, []);

  const checkIfOwnProfile = (userUid: string) => {
    auth
      .setPersistence(browserLocalPersistence)
      .then(() => {
        console.log("Persistence set");
        const user = auth.currentUser;
        if (user && user.uid === userUid) {
          setIsOwnProfile(true);
          console.log("Own profile");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserData = () => {
    // console.log(
    //   `http://127.0.0.1:5001/track-run-b9950/europe-west1/getUserData?uid=${uid}`
    // );
    fetch(
      `http://127.0.0.1:5001/track-run-b9950/europe-west1/getUserData?uid=${uid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setUserData(result.userData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserRunData = () => {
    // console.log(
    //   `http://127.0.0.1:5001/track-run-b9950/europe-west1/getUserRunData?uid=${uid}`
    // );
    fetch(
      `http://127.0.0.1:5001/track-run-b9950/europe-west1/getUserRunData?uid=${uid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setUserRunData(result.runData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    logOut();
    navigate("/");
  };

  const handleLogNewRun = (e: any) => {
    e.preventDefault();
    console.log("Log new run");
    // console.log(distanceKm, timeHours, timeMinutes);

    const runDate = new Date();

    fetch("http://localhost:3000/api/create-new-run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: userData.uid,
        runDistanceKm: distanceKm,
        runAveragePace: averagePace,
        runDate: runDate,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then((r) => console.log("Error:", r.error));
          return;
        }
        res.json().then((text) => {
          console.log(text.success);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const calculateAveragePace = (
    distance_km: any,
    time_hours: any,
    time_minutes: any
  ) => {
    if (!distance_km) {
      return;
    }
    if (!time_hours && !time_minutes) {
      return;
    }

    //calculate average pace
    let minutes = 0;

    if (!time_hours) {
      minutes = time_minutes;
    } else if (!time_minutes) {
      minutes = time_hours * 60;
    } else {
      minutes = time_hours * 60 + time_minutes;
    }

    const paceMinPerKm = minutes / distance_km;
    console.log("minutes: ", minutes);
    console.log("pace: ", paceMinPerKm);
    updateAveragePace(paceMinPerKm);
  };

  const updateDistnaceKmInput = (e: any) => {
    updateDistanceKm(Number(e.target.value));
    calculateAveragePace(Number(e.target.value), timeHours, timeMinutes);
  };

  const updateTimeHoursInput = (e: any) => {
    updateTimeHours(Number(e.target.value));
    calculateAveragePace(distanceKm, Number(e.target.value), timeMinutes);
  };

  const updateTimeMinutesInput = (e: any) => {
    updateTimeMinutes(Number(e.target.value));
    calculateAveragePace(distanceKm, timeHours, Number(e.target.value));
  };

  // return (
  //   <div className={styles.container}>
  //     {/* <Container
  //       sx={{ width: "100wh", height: "100vh", backgroundColor: "red" }}
  //     > */}
  //     <Navbar></Navbar>
  //     {/* </Container> */}
  //     {userData ? (
  //       <HeaderContext.Provider
  //         value={{
  //           displayName: userData.displayName,
  //           photoURL: userData.photoURL,
  //           isOwnProfile: isOwnProfile,
  //         }}
  //       >
  //         <Header />
  //       </HeaderContext.Provider>
  //     ) : (
  //       <h1>Loading...</h1>
  //     )}

  //     <Dashboard />

  //     {/* {isOwnProfile && (
  //       <div>
  //         <form onSubmit={(e) => handleLogNewRun(e)}>
  //           <input
  //             onChange={(e) => updateDistnaceKmInput(e)}
  //             type="text"
  //             placeholder="Run distnace (in km)"
  //           />
  //           <input
  //             onChange={(e) => updateTimeHoursInput(e)}
  //             type="text"
  //             placeholder="time hours"
  //           />
  //           <input
  //             onChange={(e) => updateTimeMinutesInput(e)}
  //             type="text"
  //             placeholder="time minutes"
  //           />
  //           <button>submit</button>
  //         </form>
  //         <p>Average pace: {averagePace} min/km</p>
  //       </div>
  //     )} */}
  //     {/* {userRunData && (
  //       <div>
  //         {userRunData.map((run: any, idx: number) => (
  //           <div key={idx}>
  //             <p>Run date: {run.runDate}</p>
  //             <p>Run distance: {run.runDistanceKm} km</p>
  //             <p>Run average pace: {run.runAveragePace} min/km</p>
  //           </div>
  //         ))}
  //       </div>
  //     )} */}
  //     <button onClick={() => handleLogout()}>sign out</button>
  //   </div>
  // );

  const svgPath =
    "M320 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM125.7 175.5c9.9-9.9 23.4-15.5 37.5-15.5c1.9 0 3.8 .1 5.6 .3L137.6 254c-9.3 28 1.7 58.8 26.8 74.5l86.2 53.9-25.4 88.8c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l28.7-100.4c5.9-20.6-2.6-42.6-20.7-53.9L238 299l30.9-82.4 5.1 12.3C289 264.7 323.9 288 362.7 288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H362.7c-12.9 0-24.6-7.8-29.5-19.7l-6.3-15c-14.6-35.1-44.1-61.9-80.5-73.1l-48.7-15c-11.1-3.4-22.7-5.2-34.4-5.2c-31 0-60.8 12.3-82.7 34.3L57.4 153.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l23.1-23.1zM91.2 352H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h69.6c19 0 36.2-11.2 43.9-28.5L157 361.6l-9.5-6c-17.5-10.9-30.5-26.8-37.9-44.9L91.2 352z";

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "blue",
        width: "100%",
        height: "100%",
      }}
    >
      <AppBar
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: "4rem",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            backgroundColor: "red",
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
            <SvgIcon
              fontSize="large"
              sx={{ fill: "white", mr: 2 }}
              viewBox="0 0 512 512"
            >
              <path d={svgPath} />
            </SvgIcon>
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
          <Avatar
            src={
              "https://lh3.googleusercontent.com/a/AGNmyxbcaXwpMhwvHSAMhAlJEEiWAcKWoEckZQqElq8HpA=s96-c"
            }
            sx={{ width: 52, height: 52 }}
          />
        </Box>
      </AppBar>
      <Box
        sx={{
          background: "green",
          marginTop: "4rem",
          width: "100%",
          display: "flex",
        }}
      >
        <Box
          sx={{
            display: "flex",
            background: "dodgerblue",
            // flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <IconButton
            sx={{ height: "50px", display: open ? "none" : "block" }}
            onClick={toggleDrawer}
          >
            <ArrowForwardIosIcon />
          </IconButton>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: "pink",
              marginLeft: open ? "100px" : 0,
              transition: "margin-left 0.2s ease-in-out",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>TESTING</div>
          </Box>

          <Drawer
            hideBackdrop={true}
            sx={{
              transition: "width 0.2s ease-in-out",
              height: "100%",
              width: open ? "200px" : "50px",
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: open ? "200px" : "50px",
                height: "100%",
                marginTop: "4rem",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                background: "dodgerblue",
                width: "100%",
                height: "100%",
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {/* <Button onClick={toggleDrawer}>CLOSE</Button> */}
                <IconButton
                  sx={{ height: "50px", display: open ? "block" : "none" }}
                  onClick={toggleDrawer}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
              </div>
              <Divider />
              <Box
                sx={{
                  background: "green",
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              ></Box>
            </Box>
          </Drawer>
        </Box>
      </Box>
      {/* <Drawer
        variant="permanent"
        open={true}
        sx={{
          flexShrink: 0,
          width: "240px",
          zIndex: (theme) => theme.zIndex.drawer,
          "& .MuiDrawer-paper": {
            width: "240px",
            boxSizing: "border-box",
            marginTop: "4rem", // add margin to the top
          },
        }}
      >
        TEST
      </Drawer> */}

      {/* <Button
          sx={{ display: open ? "none" : "block" }}
          onClick={toggleDrawer}
        >
          O
        </Button> */}
    </Box>
  );
}

// const gridStyles = ;s
