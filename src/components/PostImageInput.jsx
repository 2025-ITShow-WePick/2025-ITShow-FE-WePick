import React from 'react';
import styles from '../styles/CreatePostPage.module.css'

const PostImageInput = ({ value, onImageChange }) => {

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
  };

  return (
    <div className={styles.imageInputContainer}>
      <p className={styles.uploadTitle}>사진 업로드</p>
      <div className={styles.uploadBox}>
        <input
          type="file"
          onChange={handleFileChange}
          className={styles.uploadInput}
          id="fileUpload"
          style={{ display: 'none' }}
        />
        <label htmlFor="fileUpload" className={styles.uploadLabel}>
          <span className={styles.plusIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="51" viewBox="0 0 50 22" fill="none">
              <path d="M24.9292 0.5V50.5" stroke="black" strokeWidth="3" />
              <path d="M0 25.4302L50 25.4302" stroke="black" strokeWidth="3" />
            </svg>
          </span>
          <span className={styles.uploadText}>사진 업로드</span>
        </label>
        <span className={styles.cameraText}>(사진 찍기)</span>
      </div>
    </div>
  );
}


export default PostImageInput;
