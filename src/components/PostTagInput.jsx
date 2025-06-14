import React, { useState } from 'react';
import InputWrapper from './InputWrapper';
import styles from '../styles/CreatePostPage.module.css'
import Dropdown from './Dropdown';
import TagSelector from './TagSelector';

const TAGS = [
    { value: '혼자', label: '혼자', color: '#006BFF' },
    { value: '연인와 함께', label: '연인와 함께', color: '#FF77B7' },
    { value: '친구와 함께', label: '친구와 함께', color: '#F95454' },
    { value: '가족과 함께', label: '가족과 함께', color: '#FFE31A' },
    { value: '동료와 함께', label: '동료와 함께', color: '#007F73' },
];

const PostTagInput = ({ tagValue, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    // 태그 값을 일관되게 처리 - 배열의 첫 번째 요소 또는 빈 문자열
    const currentTagValue = Array.isArray(tagValue) && tagValue.length > 0 ? tagValue[0] : '';

    // tagValue가 배열인지 문자열인지 확인하여 처리
    const selectedTag = TAGS.find(tag => tag.value === currentTagValue);

    console.log('현재 tagValue:', tagValue, 'currentTagValue:', currentTagValue, 'selectedTag:', selectedTag);


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
        // console.log('선택된 태그 값:', newTagValue); // 디버깅용 로그
        // if (typeof newTagValue === 'string') {
        //     onChange([newTagValue]);
        // } else if (Array.isArray(newTagValue)) {
        //     onChange(newTagValue);
        // } else {
        //     onChange([]);
        // }
        // setIsOpen(false);
        console.log('선택된 태그:', newTagValue);

        // TagSelector는 문자열(tag.value)을 전달하므로 배열로 변환
        onChange([newTagValue]);
        setIsOpen(false);
    };

    const menu = (
        <TagSelector
            tags={TAGS}
            value={currentTagValue}
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