import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/SearchPhoto.module.css";
import tagImages from "../data/tagImages.json";

export default function SearchPhoto({ tag }) {
  const [clicked, setClicked] = useState(false);
  const [showSorted, setShowSorted] = useState(false);
  const scrollRef = useRef(null);

  const images = tagImages[tag] || [];
  const stackedImages = images.slice(-5);

  useEffect(() => {
    if (clicked && scrollRef.current) {
      // spread(펼친) 상태에서 스크롤 중앙 정렬
      const scrollEl = scrollRef.current;
      const centerX = (scrollEl.scrollWidth - scrollEl.clientWidth) / 2;
      scrollEl.scrollLeft = centerX;
    }
  }, [clicked]);

  useEffect(() => {
    let timeout;
    if (clicked) {
      timeout = setTimeout(() => {
        setShowSorted(true);
      }, 400); // stackedLayer의 transition 시간에 맞춤
    } else {
      setShowSorted(false); // 클릭 해제 시 즉시 정렬 이미지 감춤
    }
    return () => clearTimeout(timeout);
  }, [clicked]);

  const handleToggle = () => setClicked((prev) => !prev);

  return (
    <div className={styles.placeholderWrapper}>
      <div
        className={`${styles.placeholderBox} ${clicked ? styles.expanded : ""}`}
        onClick={handleToggle}
        style={{ cursor: "pointer" }}
      >
        {/* Stacked 상태: 항상 렌더링, 클릭 시 숨김 처리 */}
        <div
          className={`${styles.stackedLayer} ${clicked ? styles.hidden : ""}`}
        >
          {stackedImages.map((img, n) => (
            <div
              key={n}
              className={`${styles.placeholderStack} ${
                styles[`stack${n + 1}`]
              }`}
            >
              <img
                src={img}
                alt={`추천 이미지 ${n + 1}`}
                className={styles.stackImage}
              />
            </div>
          ))}
          <div className={styles.placeholderClick}>
            <div className={styles.clickIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="34"
                viewBox="0 0 44 52"
                fill="none"
              >
                <path
                  d="M13.7637 28.4003V8.00027C13.7637 7.04549 14.1355 6.12982 14.7974 5.45468C15.4593 4.77955 16.357 4.40027 17.2931 4.40027C18.2291 4.40027 19.1269 4.77955 19.7888 5.45468C20.4506 6.12982 20.8225 7.04549 20.8225 8.00027V26.0003M20.8225 24.8003V20.0003C20.8225 19.0455 21.1943 18.1298 21.8562 17.4547C22.5181 16.7796 23.4158 16.4003 24.3519 16.4003C25.288 16.4003 26.1857 16.7796 26.8476 17.4547C27.5095 18.1298 27.8813 19.0455 27.8813 20.0003V26.0003M27.8813 22.4003C27.8813 21.4455 28.2532 20.5298 28.9151 19.8547C29.577 19.1796 30.4747 18.8003 31.4107 18.8003C32.3468 18.8003 33.2445 19.1796 33.9064 19.8547C34.5683 20.5298 34.9401 21.4455 34.9401 22.4003V26.0003"
                  stroke="#898989"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M34.9412 24.8C34.9412 23.8452 35.313 22.9295 35.9749 22.2544C36.6368 21.5793 37.5345 21.2 38.4706 21.2C39.4066 21.2 40.3044 21.5793 40.9663 22.2544C41.6282 22.9295 42 23.8452 42 24.8V35.6C42 39.4191 40.5126 43.0818 37.865 45.7823C35.2175 48.4829 31.6266 50 27.8824 50H23.1765H23.6659C21.3279 50.0004 19.0263 49.4085 16.968 48.2775C14.9096 47.1465 13.1589 45.5117 11.8729 43.52L11.4118 42.8C10.6776 41.6512 8.10039 37.0688 3.68 29.0528C3.22929 28.2357 3.1089 27.2714 3.34443 26.3652C3.57996 25.4589 4.15282 24.6821 4.94118 24.2C5.78125 23.6873 6.76495 23.475 7.73661 23.5967C8.70828 23.7185 9.61239 24.1672 10.3059 24.872L13.7647 28.4M6.70588 4.4L4.35294 2M4.35294 14H2M27.8824 4.4L30.2353 2M30.2353 11.6H32.5882"
                  stroke="#898989"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.clickText}>click</div>
          </div>
        </div>

        {showSorted && (
          <div className={styles.sortedScroll} ref={scrollRef}>
            {images.map((img, i) => (
              <div key={i} className={styles.sortedSlot}>
                <div className={styles.sortedContainer}>
                  {img && (
                    <img
                      src={img}
                      alt={`추천 이미지 ${i + 1}`}
                      className={styles.stackImage}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
