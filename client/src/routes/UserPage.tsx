import { useParams, useNavigate } from "react-router-dom";

import { logOut, auth, getUserByUid } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (!uid) {
      console.log("No uid");
      return;
    }

    fetch(`http://localhost:3000/api/get-user-data?uid=${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          res.json().then((r) => console.log("Error:", r.error));
          return;
        }
        res.json().then((text) => {
          console.log(text.success);
          console.log(text.runsData);
          setUserRunData(text.runsData);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user); // TODO: change it to get userData from database
        if (user && user.uid === uid) {
          setIsOwnProfile(true);
          console.log("Own profile");
        }

        // setUserUid(user.uid);
        // setUser(user);
        // setUserDisplayName(user.displayName);
        // setUserPhotoUrl(user.photoURL);
        // console.log(user);
      } else {
        console.log("no user");
        getUserByUid(uid)
          .then((user) => {
            console.log(user);
            setUserData(user.userData);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }, []);

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
    <div>
      <button onClick={() => handleLogout()}>sign out</button>
      {userData ? (
        <div>
          <h1>{userData.displayName}</h1>
          <img src={userData.photoURL} alt="" />
        </div>
      ) : (
        <h1>Loading...</h1>
      )}

      {isOwnProfile && (
        <div>
          <p>Own profile</p>
          <h1>Runs</h1>
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
      )}
      {userRunData && (
        <div>
          {userRunData.map((run: any, idx: number) => (
            <div key={idx}>
              <p>Run date: {run.runDate}</p>
              <p>Run distance: {run.runDistanceKm} km</p>
              <p>Run average pace: {run.runAveragePace} min/km</p>

              <p>
                Run time: {run.runTimeHours} hours {run.runTimeMinutes} minutes
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
