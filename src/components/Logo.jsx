import React from "react";
import styles from "../styles/Logo.module.css";

import wepickLogo from "../assets/images/wepick_logo.png";

export default function Logo() {
  return <img src={wepickLogo} className={styles.wepickLogo} alt="logo" />;
}
