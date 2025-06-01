import React from "react";
import styles from "../styles/FieldBox.module.css";

export default function MemoBox({ label, value }) {
  return (
    <div className={styles.memoBox}>
      <label className={styles.label}>{label}</label>
      <textarea className={styles.textarea} value={value} readOnly />
    </div>
  );
}
