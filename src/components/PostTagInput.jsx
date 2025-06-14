import React, { useState } from 'react';
import InputWrapper from './InputWrapper';
import styles from '../styles/CreatePostPage.module.css'
import Dropdown from './Dropdown';
import TagSelector from './TagSelector';

const TAGS = [
    { value: 'solo', label: '혼자', color: '#006BFF' },
    { value: 'couple', label: '연인와 함께', color: '#FF77B7' },
    { value: 'friends', label: '친구와 함께', color: '#F95454' },
    { value: 'family', label: '가족과 함께', color: '#FFE31A' },
    { value: 'coworker', label: '동료와 함께', color: '#007F73' },
];

const PostTagInput = ({ tagValue, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    // tagValue가 배열인지 문자열인지 확인하여 처리
    const selectedTag = TAGS.find((tag) => {
        const valueToCheck = Array.isArray(tagValue) ? tagValue[0] : tagValue;
        return tag.value === valueToCheck;
    });
    console.log('현재 tagValue:', tagValue, 'selectedTag:', selectedTag); // 디버깅용

    const trigger = selectedTag ? (
        <button
            className={styles.tagButton}
            type="button"
            style={{
                background: selectedTag.color,
                color: selectedTag.value === 'family' ? '#000' : '#fff',
            }}
            onClick={(e) => {
                e.stopPropagation();
                onChange([]);
            }}
        >
            {selectedTag.label}
        </button>
    ) : (
        <span>함께 찍은 사람과의 관계를 선택해주세요</span>
    );

    const handleTagChange = (newTagValue) => {
        console.log('선택된 태그 값:', newTagValue); // 디버깅용 로그
        onChange(newTagValue);
        setIsOpen(false); // 태그 선택 후 드롭다운 닫기
    };

    const menu = (
        <TagSelector
            tags={TAGS}
            value={tagValue}
            onChange={handleTagChange} />
    );

    return (
        <InputWrapper label="관계 태그">
            <Dropdown
                trigger={trigger}
                menu={menu}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </InputWrapper>
    );
};

export default PostTagInput;