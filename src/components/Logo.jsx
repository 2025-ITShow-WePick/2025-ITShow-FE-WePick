import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Logo.module.css";

import wepickLogo from "../assets/images/wepick_logo.png";

export default function Logo() {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Logo clicked");
    navigate("/");
  };

  return (
    <img
      src={wepickLogo}
      className={styles.wepickLogo}
      alt="logo"
      onClick={handleClick}
    />
  );
}
