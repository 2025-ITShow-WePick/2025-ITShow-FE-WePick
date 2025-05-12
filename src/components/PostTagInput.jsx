import React, { useEffect } from 'react';

const PostTagInput = () => {

    return (
        <div>
            <label>관계 태그</label>
            <select>
                <option value="solo">혼자</option>
                <option value="couple">연인와 함께</option>
                <option value="friends">친구와 함께</option>
                <option value="family">가족와 함께</option>
                <option value="coworker">동료와 함께</option>
                {/* <option value="etc">기타</option> */}
            </select>
        </div>
    );
};

export default PostTagInput;
