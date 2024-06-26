import { useLocation, useNavigate, useParams } from "react-router-dom";

import { auth, functions, logOut } from "../firebase/firebase";

import { browserLocalPersistence } from "firebase/auth";
import { useEffect, useState } from "react";

import "./index.css";

import { Box, Grid, Paper, Stack } from "@mui/material";
import HeaderContext from "../contexts/HeaderContext";

import { httpsCallable } from "firebase/functions";
import Dashboard from "../components/Dashboard";
import NavigationDrawer from "../components/Drawer/NavigationDrawer";
import RunList from "../components/RunLogs/RunList";
import UserPageAppBar from "../components/UserPageAppBar";

export default function UserPage() {
  const { userId: uid } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [distanceKm, updateDistanceKm] = useState<number>();
  const [timeHours, updateTimeHours] = useState<number>();
  const [timeMinutes, updateTimeMinutes] = useState<number>();

  const [averagePace, updateAveragePace] = useState<number>();

  const [userRunData, setUserRunData] = useState<any>(null);

  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log(hash);
  // }, [hash]);

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
        // console.log(result.userData);
        setUserData(result.userData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!uid) {
      console.log("No uid");
      return;
    }

    checkIfOwnProfile(uid);
    fetchUserData();

    // fetchUserData();
    // fetchUserRunData();
  }, [uid]);

  // useEffect(() => {
  //   if (uid === "undefined") {
  //     console.log("No uid");
  //     return;
  //   }

  // }, [uid]);

  // const fetchUserRunData = () => {
  //   // console.log(
  //   //   `http://127.0.0.1:5001/track-run-b9950/europe-west1/getUserRunData?uid=${uid}`
  //   // );
  //   fetch(
  //     `http://127.0.0.1:5001/track-run-b9950/europe-west1/getUserRunData?uid=${uid}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       // console.log(result);
  //       setUserRunData(result.runData);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

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

  const [open, setOpen] = useState(false);
  const drawerWidthOpen = "200px";
  const drawerWidthClosed = "50px";

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const headerHeight = "4rem";

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "blue",
        width: "100%",
        height: "100%",
      }}
    >
      {/* {userData && ( */}
      <HeaderContext.Provider
        value={{
          displayName: userData?.displayName,
          photoURL: userData?.photoURL,
          isOwnProfile: isOwnProfile,
        }}
      >
        <UserPageAppBar height={headerHeight} />
      </HeaderContext.Provider>
      {/* )} */}
      <Box
        sx={{
          // background: "green",
          marginTop: headerHeight,
          width: "100%",
          display: "flex",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            background: "rgb(39, 39, 39)",
            // flexDirection: "column",
            backgroundColor: "green",
            flexGrow: 1,
          }}
        >
          {/* <Box
            sx={{
              borderRight: "2px solid rgb(77, 77, 77)",
            }}
          >
            {/* <div
              style={{
                backgroundColor: "red",
                display: "flex",
                alignItems: "center",
                background: "rgb(59, 59, 59)",
              }}
            // ></div>
          </Box> */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              // marginTop: "4rem",
              backgroundColor: "rgb(39, 39, 39)",
              marginLeft: open ? drawerWidthOpen : drawerWidthClosed,
              // transition: "margin-left 0.1s ease-in-out",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                background: "black",
                boxSizing: "border-box",
                flexGrow: 1,
                height: "calc(100% - 2rem)",
                m: 2,
                p: 2,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "0.5rem",
              }}
            >
              {/* <RunList /> */}
              <Dashboard />
            </Box>
          </Box>
        </Box>
        <NavigationDrawer
          widthClosed={drawerWidthClosed}
          widthOpen={drawerWidthOpen}
          open={open}
          toggleDrawer={toggleDrawer}
        />
      </Box>
    </Box>
  );
}
