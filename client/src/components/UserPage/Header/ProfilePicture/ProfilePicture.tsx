import styles from "./ProfilePicture.module.css";

import HeaderContext from "../../../../contexts/HeaderContext";
import { useContext } from "react";

export default function ProfilePicture() {
  const { photoURL, isOwnProfile } = useContext(HeaderContext);

  return (
    <div
      className={`${styles.container} ${isOwnProfile ? styles.ownProfile : ""}`}
    >
      <div className={styles.pictureWrapper}>
        <img src={photoURL} alt="Profile picture"></img>
      </div>
    </div>
  );
}
