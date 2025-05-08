import React, { useState } from "react";
import styles from "../styles/SplashPage.module.css";

import wepickLogo from "../assets/images/wepick_logo.png";
import splashImg1 from "../assets/images/splashImg1.png";
import splashImg2 from "../assets/images/splashImg2.png";
import splashImg3 from "../assets/images/splashImg3.png";
import splashImg4 from "../assets/images/splashImg4.png";
import splashImg5 from "../assets/images/splashImg5.png";
import splashImg6 from "../assets/images/splashImg6.png";
import splashImg7 from "../assets/images/splashImg7.png";
import splashImg8 from "../assets/images/splashImg8.png";

const splashImg = [
  splashImg1,
  splashImg2,
  splashImg3,
  splashImg4,
  splashImg5,
  splashImg6,
  splashImg7,
  splashImg8,
];

export default function SplashPage() {
  const [spread, setSpread] = useState(false);

  const handleClick = () => {
    setSpread((prev) => !prev);
  };

  return (
    <>
      {<div className={`${styles.overlay} ${spread ? styles.show : ""}`} />}
      <div className={styles.wepickLogoSubtitle}>
        <img src={wepickLogo} className={styles.wepickLogo} />
        <p className={styles.wepickSubtitle}>Capturing Moments And Memories</p>
      </div>
      <div className={styles.imageStack} onClick={handleClick}>
        {[...splashImg].map((src, i) => {
          const offsetX = (Math.random() - 0.5) * 40;
          const offsetY = (Math.random() - 0.5) * 40;

          return (
            <img
              key={i}
              src={src}
              alt={`img${i}`}
              className={`${styles.stackImg} ${styles[`img${i}`]} ${
                spread ? styles[`spread${i}`] : styles.stacked
              }`}
              style={{
                transform: spread
                  ? undefined
                  : `translate(${offsetX}px, ${offsetY}px)`,
                zIndex: 10 - i,
              }}
            />
          );
        })}
      </div>
      <div className={styles.btnPlusBox}>
        <button
          className={`${styles.btnPlus} ${spread ? styles.rotated : ""}`}
          onClick={handleClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="62"
            height="62"
            viewBox="0 0 89 89"
            fill="none"
          >
            <path d="M44.126 0V88.5" stroke="black" strokeWidth="6" />
            <path d="M0 44.126L88.5 44.126" stroke="black" strokeWidth="6" />
          </svg>
        </button>
      </div>
    </>
  );
}
