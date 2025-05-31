import React, { useState } from 'react';
import Logo from '../components/Logo';
import PostImageInput from '../components/PostImageInput';
// import PostImageInputGroup from '../components/PostImageInputGroup'
import PostLocationInput from '../components/PostLocationInput';
import PostDateInput from '../components/PostDateInput';
import PostMemoInput from '../components/PostMemoInput';
import PostTagInput from '../components/PostTagInput';
import PostUploadButton from '../components/PostUploadButton';
import styles from '../styles/CreatePostPage.module.css'
import InputWrapper from '../components/InputWrapper';
// import styles from '../styles/CommInput.module.css'


const CreatePostPage = () => {
    console.time("CreatePostPage 렌더링");

    const [formData, setFormData] = useState({
        image: null,
        location: '',
        date: '',
        memo: '',
        tags: [],
    });

    // formData 상태를 업데이트
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div>
            <Logo />
            <h2 className={styles.postTitle}>게시물 작성</h2>
            <div className={styles.inputContainer}>
                <div className={styles.postInputContainer}>
                    <PostImageInput
                        value={formData.image}
                        onChange={file => handleInputChange('image', file)}
                    />
                </div>
                <div className={styles.rightPostInputGroup}>
                    <PostLocationInput
                        value={formData.location}
                        onChange={value => handleInputChange('location', value)}
                    />
                    <PostDateInput
                        value={formData.date}
                        onChange={value => handleInputChange('date', value)}
                    />
                    <PostMemoInput
                        value={formData.memo}
                        onChange={value => handleInputChange('memo', value)}
                    />
                    <PostTagInput
                        value={formData.tags}
                        onChange={value => handleInputChange('memo', value)}
                    />
                    <PostUploadButton />
                </div>
            </div>

        </div>
    );
};

export default CreatePostPage;
