import React, { useRef, useState, forwardRef } from 'react';
import InputWrapper from './InputWrapper';
import styles from '../styles/CreatePostPage.module.css'
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className={styles.inputWithIcon} onClick={onClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
    <input
      ref={ref}
      className={styles.dateInputCustom}
      value={value}
      placeholder={placeholder}
      readOnly
      onClick={onClick}
      style={{ flex: 1, cursor: 'pointer' }}
    />
    <span className={styles.inputIcon} style={{ marginLeft: '8px', cursor: 'pointer' }}>
      <svg
        className={styles.selectIcon}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 26 25"
        fill="none"
      >
        <path d="M23.6379 25H3.16675C1.85974 25 0.804688 23.9531 0.804688 22.6562V3.90625C0.804688 2.60938 1.85974 1.5625 3.16675 1.5625H23.6379C24.9449 1.5625 26 2.60938 26 3.90625V22.6562C26 23.9531 24.9449 25 23.6379 25ZM3.16675 3.125C2.72583 3.125 2.37939 3.46875 2.37939 3.90625V22.6562C2.37939 23.0938 2.72583 23.4375 3.16675 23.4375H23.6379C24.0789 23.4375 24.4253 23.0938 24.4253 22.6562V3.90625C24.4253 3.46875 24.0789 3.125 23.6379 3.125H3.16675Z" fill="#939393" />
        <path d="M7.89087 6.25C7.44995 6.25 7.10352 5.90625 7.10352 5.46875V0.78125C7.10352 0.34375 7.44995 0 7.89087 0C8.33179 0 8.67822 0.34375 8.67822 0.78125V5.46875C8.67822 5.90625 8.33179 6.25 7.89087 6.25ZM18.9138 6.25C18.4729 6.25 18.1265 5.90625 18.1265 5.46875V0.78125C18.1265 0.34375 18.4729 0 18.9138 0C19.3547 0 19.7012 0.34375 19.7012 0.78125V5.46875C19.7012 5.90625 19.3547 6.25 18.9138 6.25ZM25.2126 9.375H1.59204C1.15112 9.375 0.804688 9.03125 0.804688 8.59375C0.804688 8.15625 1.15112 7.8125 1.59204 7.8125H25.2126C25.6536 7.8125 26 8.15625 26 8.59375C26 9.03125 25.6536 9.375 25.2126 9.375Z" fill="#939393" />
      </svg>
    </span>
  </div>
));

const PostDateInput = ({ value, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const inputRef = useRef(null);
  // const datePickerRef = useRef(null);

  const handleChange = (date) => {
    setSelectedDate(date);
    if (date) {
      onChange(dayjs(date).format('YYYY/MM/DD'));
    } else {
      onChange('');
    }
  };

  return (
    <InputWrapper label="날짜">
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          customInput={<CustomInput placeholder="YYYY/MM/DD" value={value} />}
          dateFormat="yyyy/MM/dd"
        />
    </InputWrapper>

  );
};

export default PostDateInput;
