import { useState } from "react";
import styles from "./FormPopup.module.css";

export default function FormPopup({ onClose }: { onClose: () => void }) {
  const handleFormClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <>
      <div className={styles.overlay}></div>
      <div onClick={onClose} className={styles.container}>
        <div onClick={handleFormClick} className={styles.form}>
          <button onClick={() => console.log("test")}>SUBMIT</button>
        </div>
      </div>
    </>
  );
}
