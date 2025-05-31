import React, { useEffect } from 'react';
import InputWrapper from './InputWrapper';
import styles from '../styles/CreatePostPage.module.css'

const PostDateInput = ({ value, onChange }) => {
  return (
    <InputWrapper label="날짜">
      <input
        type="date"
        onChange={e => onChange(e.date.value)}
        value={value}
        placeholder='YYYY / MM / DD'
      />
    </InputWrapper>

  );
};

export default PostDateInput;
