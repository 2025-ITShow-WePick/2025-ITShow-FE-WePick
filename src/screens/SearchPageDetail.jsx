import React from "react";
import styles from "../styles/SearchPageDetail.module.css";
import searchView from "../data/searchView.json";
import Logo from "../components/Logo"; // 기존 로고 유지

export default function SearchPageDetail() {
  const firstResult = searchView[0];

  return (
    <div className={styles.container}>
      <Logo />
      <div className={styles.content}>
        <div className={styles.left}>
          <img src={firstResult.src} alt="포토부스" className={styles.photo} />
        </div>
        <div className={styles.right}>
          <div className={styles.field}>
            <span className={styles.label}>위치(지점)</span>
            <div className={styles.inputBox}>
              {firstResult.place}
              <span className={styles.icon}>📍</span>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>날짜</span>
            <div className={styles.inputBox}>
              {firstResult.date}
              <span className={styles.icon}>📅</span>
            </div>
          </div>

          <div className={styles.memoBox}>
            <label className={styles.label}>메모</label>
            <textarea
              className={styles.textarea}
              value={firstResult.memo}
              readOnly
            />
          </div>
        </div>
        <div className={styles.nextBtn}>
          <div className={styles.pointer}>👆</div>
          <p>
            클릭해서
            <br />
            다음 게시물 보기
          </p>
        </div>
      </div>
    </div>
  );
}
