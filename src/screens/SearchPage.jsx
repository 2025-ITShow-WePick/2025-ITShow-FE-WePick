import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/SearchPage.module.css";
import Logo from "../components/Logo";
import Hashtag from "../components/Hashtag";
import SearchPhoto from "../components/SearchPhoto";

export default function SearchPage() {
  const whoList = ["가족과 함께", "친구와 함께", "혼자서", "연인과 함께"];
  const [isPlusSelected, setIsPlusSelected] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 쿼리에서 who 값 가져오기
  const selectedWho = searchParams.get("who") || "";

  const handleHashtagClick = (who) => {
    setSearchParams({ who }); // 쿼리 파라미터 변경
  };

  const handlePlusClick = () => {
    setIsPlusSelected((prev) => !prev);
    setSearchParams({}); // 쿼리 파라미터 초기화
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

      {/* 선택된 태그가 있을 때만 SearchPhoto 렌더링 */}
      <SearchPhoto tag={selectedWho} />
    </>
  );
}
