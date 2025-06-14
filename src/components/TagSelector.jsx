// components/TagSelector.jsx
import React from 'react';
import styles from '../styles/CreatePostPage.module.css'; // 또는 TagSelector.module.css를 새로 만드셔도 OK

const TagButton = ({ tag, onClick, isSelected }) => (
    <button
        type="button"
        className={styles.tagButton}
        style={{
            background: tag.color,
            color: tag.label === '가족과 함께' ? '#000' : '#fff',
            opacity: isSelected ? 1 : 0.8,
        }}
        onClick={onClick}
    >
        {tag.label}
    </button>
);

const TagSelector = ({ tags, value, onChange }) => (
    <>
        {tags.map((tag) => (
            <TagButton
                key={tag.value}
                tag={tag}
                onClick={() => onChange(tag.value)}
                isSelected={value === tag.value}
            />
        ))}
    </>
);

export default TagSelector;
