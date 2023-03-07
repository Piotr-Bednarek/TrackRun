import styles from "./Header.module.css";

import ProfilePicture from "./ProfilePicture/ProfilePicture";
import UserHello from "./UserHello/UserHello";
import NavBar from "./NavBar/NavBar";

export default function Header() {
  return (
    <div className={styles.header}>
      <UserHello />
      <NavBar />
      <ProfilePicture />
    </div>
  );
}
