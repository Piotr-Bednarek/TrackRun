import styles from "./Dashboard.module.css";
import { useState } from "react";
import FormPopup from "./FormPopup";

export default function Dashboard() {
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);

  const toggleFormPopup = () => {
    setIsFormPopupOpen(!isFormPopupOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Your running logs</div>
        <>
          {!isFormPopupOpen ? (
            <div onClick={toggleFormPopup} className={styles.button}>
              +
            </div>
          ) : (
            <></>
          )}

          {isFormPopupOpen && <FormPopup onClose={toggleFormPopup}></FormPopup>}
        </>
      </div>

      <div className={styles.runs}>
        <div className={styles.run}>1</div>
        <div className={styles.run}>2</div>
        <div className={styles.run}>3</div>
        <div className={styles.run}>3</div>
        <div className={styles.run}>3</div>
        <div className={styles.run}>3</div>
        <div className={styles.run}>3</div>
      </div>
    </div>
  );
}
