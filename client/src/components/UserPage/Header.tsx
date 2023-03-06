import { useContext } from "react";
import styles from "./Header.module.css";

import HeaderContext from "../../contexts/HeaderContext";
import { Link } from "react-router-dom";

export default function Header() {
  // const = useContext(HeaderContext);

  const { displayName, photoURL, isOwnProfile } = useContext(HeaderContext);

  return (
    // <div className={styles.headerContainer}>
    <div className={styles.header}>
      <div className={styles.userHello}>
        <svg
          className={styles.runIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          fill="white"
        >
          <path d="M320 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM125.7 175.5c9.9-9.9 23.4-15.5 37.5-15.5c1.9 0 3.8 .1 5.6 .3L137.6 254c-9.3 28 1.7 58.8 26.8 74.5l86.2 53.9-25.4 88.8c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l28.7-100.4c5.9-20.6-2.6-42.6-20.7-53.9L238 299l30.9-82.4 5.1 12.3C289 264.7 323.9 288 362.7 288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H362.7c-12.9 0-24.6-7.8-29.5-19.7l-6.3-15c-14.6-35.1-44.1-61.9-80.5-73.1l-48.7-15c-11.1-3.4-22.7-5.2-34.4-5.2c-31 0-60.8 12.3-82.7 34.3L57.4 153.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l23.1-23.1zM91.2 352H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h69.6c19 0 36.2-11.2 43.9-28.5L157 361.6l-9.5-6c-17.5-10.9-30.5-26.8-37.9-44.9L91.2 352z" />
        </svg>
        <div>{displayName}</div>
      </div>
      {/* <HashRouter> */}
      <div className={styles.navBar}>
        <Link to={{ hash: "#logs" }}>
          <div className={styles.button}>
            <svg
              className={styles.logsIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="white"
            >
              <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
            </svg>
          </div>
        </Link>
      </div>
      {/* </HashRouter> */}
      <div
        className={`${styles.profilePicture} ${
          isOwnProfile ? styles.ownProfile : ""
        }`}
      >
        <div className={styles.pictureWrapper}>
          <img src={photoURL} alt="Profile picture"></img>
        </div>
      </div>
    </div>
    // </div>
  );
}
