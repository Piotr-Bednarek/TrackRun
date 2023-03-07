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
        <div className={styles.run}>4</div>
        <div className={styles.run}>5</div>
        <div className={styles.run}>6</div>
        <div className={styles.run}>7</div>
        <div className={styles.run}>8</div>
        <div className={styles.run}>9</div>
        <div className={styles.run}>10</div>
      </div>
      <div className={styles.paginationWrapper}>
        <div className={styles.paginationController}>
          <div className={styles.paginationButton}>
            <svg
              className={styles.paginationButtonIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
          </div>
          <div>1</div>
          <div className={styles.paginationButton}>
            <svg
              className={styles.paginationButtonIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
