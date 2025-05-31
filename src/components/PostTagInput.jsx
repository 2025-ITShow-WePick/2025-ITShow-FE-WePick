import React, { useEffect } from 'react';
import InputWrapper from './InputWrapper';
import styles from '../styles/CreatePostPage.module.css'

const PostTagInput = ({ value, onChange }) => {

    return (
        <div>
            <InputWrapper label={"관계 태그"}>
                <select
                    className={styles.select}
                    value={value}
                    onChange={e => onChange(e.target.value)}>
                    <option value="" disabled hidden>함께 찍은 사람과의 관계를 선택해주세요</option>
                    <option value="solo">혼자</option>
                    <option value="couple">연인와 함께</option>
                    <option value="friends">친구와 함께</option>
                    <option value="family">가족와 함께</option>
                    <option value="coworker">동료와 함께</option>
                    {/* <option value="etc">기타</option> */}
                </select>
            </InputWrapper>

        </div>
    );
};

export default PostTagInput;
