import React, { useEffect } from 'react';
import InputWrapper from './InputWrapper';
// import style from '../styles/InputWrapper.module.css'
import styles from '../styles/CreatePostPage.module.css'

const PostMemoInput = ({ memoValue, onChange }) => {

  return (
    <InputWrapper label={"메모"}>
      <textarea
        className={styles.defaultInput}
        typeof="text"
        value={memoValue}
        onChange={e => onChange(e.target.value)}
        placeholder="짧은 메모를 작성해주세요"
      />
    </InputWrapper>
  );
};

export default PostMemoInput;
