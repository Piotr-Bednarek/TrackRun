import { useParams, useNavigate } from "react-router-dom";

import { logOut, auth, getUserByUid } from "../firebase/firebase";

import { useState, useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";

export default function UserPage() {
  const { userUid: uid } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [distnaceKm, updateDistanceKm] = useState<number>();
  const [timeHours, updateTimeHours] = useState<number>();
  const [timeMinutes, updateTimeMinutes] = useState<number>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) {
      console.log("No uid");
      return;
    }
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
    console.log(distnaceKm, timeHours, timeMinutes);
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
              onChange={(e) => updateDistanceKm(Number(e.target.value))}
              type="text"
              placeholder="Run distnace (in km)"
            />
            <input
              onChange={(e) => updateTimeHours(Number(e.target.value))}
              type="text"
              placeholder="time hours"
            />
            <input
              onChange={(e) => updateTimeMinutes(Number(e.target.value))}
              type="text"
              placeholder="time minutes"
            />
            <button>submit</button>
          </form>
          <p>Average pace: </p>
        </div>
      )}
    </div>
  );
}
