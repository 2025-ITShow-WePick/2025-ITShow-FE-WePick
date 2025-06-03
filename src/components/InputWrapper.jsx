// components/InputWrapper.jsx
import React from 'react';
import styles from '../styles/CreatePostPage.module.css'

const InputWrapper = ({ label, children }) => {
    return (
        <div className={styles.inputWrapper}>
            {label && <div className={styles.label}>{label}</div>}
            <div className={styles.inputField}>{children}</div>
        </div>
    );
};

export default InputWrapper;
