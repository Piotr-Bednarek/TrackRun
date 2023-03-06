import { useParams, useNavigate, useLocation } from "react-router-dom";

import { logOut, auth } from "../firebase/firebase";

import { useState, useEffect } from "react";
import { browserLocalPersistence } from "firebase/auth";
import Header from "../components/UserPage/Header";

import "./index.css";
import styles from "./UserPage.module.css";

import HeaderContext from "../contexts/HeaderContext";
import Dashboard from "../components/UserPage/Dashboard";

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

  return (
    <div className={styles.container}>
      {userData ? (
        <HeaderContext.Provider
          value={{
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            isOwnProfile: isOwnProfile,
          }}
        >
          <Header />
        </HeaderContext.Provider>
      ) : (
        <h1>Loading...</h1>
      )}

      <Dashboard />

      {/* {isOwnProfile && (
        <div>
          <form onSubmit={(e) => handleLogNewRun(e)}>
            <input
              onChange={(e) => updateDistnaceKmInput(e)}
              type="text"
              placeholder="Run distnace (in km)"
            />
            <input
              onChange={(e) => updateTimeHoursInput(e)}
              type="text"
              placeholder="time hours"
            />
            <input
              onChange={(e) => updateTimeMinutesInput(e)}
              type="text"
              placeholder="time minutes"
            />
            <button>submit</button>
          </form>
          <p>Average pace: {averagePace} min/km</p>
        </div>
      )} */}
      {/* {userRunData && (
        <div>
          {userRunData.map((run: any, idx: number) => (
            <div key={idx}>
              <p>Run date: {run.runDate}</p>
              <p>Run distance: {run.runDistanceKm} km</p>
              <p>Run average pace: {run.runAveragePace} min/km</p>
            </div>
          ))}
        </div>
      )} */}
      <button onClick={() => handleLogout()}>sign out</button>
    </div>
  );
}
