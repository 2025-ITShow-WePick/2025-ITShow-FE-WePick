import React, { useState } from 'react';
import PostImageInput from '../components/PostImageInput';
import PostLocationInput from '../components/PostLocationInput';
import PostDateInput from '../components/PostDateInput';
import PostMemoInput from '../components/PostMemoInput';
import PostTagInput from '../components/PostTagInput';
import PostUploadButton from '../components/PostUploadButton';

const CreatePostPage = () => {
    console.time("CreatePostPage 렌더링");

    const [formData, setFormData] = useState({
        image: null,
        location: '',
        date: '',
        memo: '',
        tags: [],
    });

    return (
        <div>
            <h2>게시물 작성</h2>
            <div>
                <PostImageInput />
            </div>
            <div>
                <PostLocationInput />
                <PostDateInput />
                <PostMemoInput />
            </div>
            <div>
                <PostTagInput />
            </div>
            <div>
                <PostUploadButton />
            </div>
        </div>
    );
};

export default CreatePostPage;
