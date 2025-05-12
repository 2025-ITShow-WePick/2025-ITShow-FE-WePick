import React from "react";
import styles from "../styles/Hashtag.module.css";

export default function Hashtag({ who, isSelected, onClick, className }) {
  return (
    <button
      className={`${styles.hashtagBtn} ${
        isSelected ? styles.clicked : ""
      } ${className}`}
      onClick={onClick}
    >
      {who}
    </button>
  );
}
