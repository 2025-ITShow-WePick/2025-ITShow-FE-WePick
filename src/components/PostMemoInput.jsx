import React, { useEffect } from 'react';
import InputWrapper from './InputWrapper';
// import style from '../styles/InputWrapper.module.css'
import styles from '../styles/CreatePostPage.module.css'

const PostMemoInput = ({ value, onChange }) => {

  return (
    <InputWrapper label={"메모"}>
      <textarea
        className={styles.memoInput}
        typeof="text"
        value={value}
        onChange={e => onChange(e.text.value)}
        placeholder="짧은 메모를 작성해주세요"
      />
    </InputWrapper>
  );
};

export default PostMemoInput;
