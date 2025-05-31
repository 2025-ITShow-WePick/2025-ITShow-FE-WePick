import React from 'react';
import styles from '../styles/CreatePostPage.module.css'

const UploadButton = ({ onClick }) => {
    return (
        <button onClick={onClick} style={styles.Button}>
            업로드
        </button>
    );
};

export default UploadButton