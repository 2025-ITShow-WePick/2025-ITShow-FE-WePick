import React from 'react';
import styles from '../styles/CreatePostPage.module.css'

const UploadButton = ({ onClick }) => {
    return (
        <div className={styles.buttonContainer}>
            <button onClick={onClick} className={styles.button}>
                업로드
            </button>
        </div>
    );
};

export default UploadButton