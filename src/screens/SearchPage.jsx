import React, { useState } from "react";
import styles from "../styles/SearchPage.module.css";
import Logo from "../components/Logo";
import Hashtag from "../components/Hashtag";

export default function SearchPage() {
  const whoList = ["가족과 함께", "친구와 함께", "혼자서", "연인과 함께"];
  const [selectedWho, setSelectedWho] = useState("");
  const [isPlusSelected, setIsPlusSelected] = useState(false);

  const handleHashtagClick = (who) => {
    setSelectedWho(who);
  };

  const handlePlusClick = () => {
    setIsPlusSelected((prev) => !prev);
    setSelectedWho(""); // 클릭될 때마다 초기화
  };

  const iconColor = isPlusSelected ? "#000000" : "#8b8b8b";

  return (
    <>
      <Logo />
      <div className={styles.wepickHashtags}>
        {whoList.map((who) => (
          <Hashtag
            key={who}
            who={who}
            isSelected={selectedWho === who}
            onClick={() => handleHashtagClick(who)}
            className={`${styles.hashtag} ${
              isPlusSelected ? styles.visible : ""
            }`}
          />
        ))}

        <button
          className={`${styles.hashtagPlus} ${
            isPlusSelected ? styles.clicked : ""
          }`}
          onClick={handlePlusClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
          >
            <path
              d="M19.3457 6.61822L6.61778 19.3461"
              stroke={iconColor}
              strokeWidth="2"
            />
            <path
              d="M6.6543 6.61822L19.3822 19.3461"
              stroke={iconColor}
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
