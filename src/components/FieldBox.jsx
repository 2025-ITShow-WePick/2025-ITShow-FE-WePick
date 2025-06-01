import React from "react";
import styles from "../styles/FieldBox.module.css";

export default function FieldBox({ label, value, icon }) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.inputBox}>
        <span className={styles.value}>{value}</span>
        <span className={styles.icon}>{icon}</span>
      </div>
    </div>
  );
}
