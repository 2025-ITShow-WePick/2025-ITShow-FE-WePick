import React, { useState } from "react";
import styles from "../styles/SplashPage.module.css";
import Logo from "../components/Logo";

import splashImg1 from "../assets/images/splashImg1.png";
import splashImg2 from "../assets/images/splashImg2.png";
import splashImg3 from "../assets/images/splashImg3.png";
import splashImg4 from "../assets/images/splashImg4.png";
import splashImg5 from "../assets/images/splashImg5.png";
import splashImg6 from "../assets/images/splashImg6.png";
import splashImg7 from "../assets/images/splashImg7.png";
import splashImg8 from "../assets/images/splashImg8.png";
import { Link } from "react-router-dom";

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

// 펼침 좌표 (spread 상태에서 각 이미지가 이동할 위치)
const spreadTransforms = [
  { x: -280, y: -240 },
  { x: -15, y: -171 },
  { x: 224, y: -220 },
  { x: -245, y: -70 },
  { x: 110, y: 56 },
  { x: -419, y: 142 },
  { x: -161, y: 286 },
  { x: 434, y: 160 },
];

export default function SplashPage() {
  const [spread, setSpread] = useState(false);

  // 랜덤 offset은 spread 상태가 바뀔 때마다 새로 생성
  const [randomOffsets, setRandomOffsets] = useState(
    splashImg.map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
    }))
  );

  // spread 상태가 false로 돌아갈 때 랜덤 offset 새로 생성
  const handleClick = () => {
    if (spread) {
      setSpread(false);
      setRandomOffsets(
        splashImg.map(() => ({
          x: (Math.random() - 0.5) * 40,
          y: (Math.random() - 0.5) * 40,
        }))
      );
    } else {
      setSpread(true);
    }
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${spread ? styles.show : ""}`}
        onClick={handleClick}
      />
      <div className={styles.wepickLogoSubtitle}>
        <Logo />
        <p
          className={`${styles.wepickSubtitle} ${spread ? styles.hidden : ""}`}
        >
          Capturing Moments And Memories
        </p>
      </div>
      <div className={styles.imageStack} onClick={handleClick}>
        {[...splashImg].map((src, i) => (
          <div
            key={i}
            className={styles.stackImgWrapper}
            style={{
              zIndex: 10 - i,
              transform: spread
                ? `translate(${spreadTransforms[i].x}px, ${spreadTransforms[i].y}px)`
                : `translate(${randomOffsets[i].x}px, ${randomOffsets[i].y}px)`,
              transition: "transform 0.8s ease-in-out, opacity 0.5s",
            }}
          >
            <img
              src={src}
              alt={`img${i}`}
              className={
                styles.stackImg +
                " " +
                styles[`img${i}`] +
                " " +
                (!spread ? styles.wiggle : "")
              }
              style={{
                animationDelay: `${i * 0.4}s`, // 각 사진마다 파도 타이밍 다르게!
              }}
            />
          </div>
        ))}
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
            <path d="M44.126 0V88.5" stroke="black" strokeWidth="7" />
            <path d="M0 44.126L88.5 44.126" stroke="black" strokeWidth="7" />
          </svg>
        </button>
      </div>
      <div className={`${styles.overlayButtons} ${spread ? styles.show : ""}`}>
        <Link to="/search">
          <button className={styles.overlayBtn1}>SEARCH</button>
        </Link>
        <Link to="/post">
          <button className={styles.overlayBtn2}>
            UPLOAD &nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;PHOTO
          </button>
        </Link>
      </div>
    </>
  );
}
