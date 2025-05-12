// import React, { useEffect } from 'react';

// const PostImageInput = () => {
//   useEffect(() => {
//     console.time("PostImageInput 렌더링");  // 시작

//     // 컴포넌트 언마운트 시 종료 타이머
//     return () => {
//       console.timeEnd("PostImageInput 렌더링");  // 끝
//     };
//   }, []);  // 빈 배열로 마운트/언마운트 시에만 실행

//   return (
//     <div>
//       <label>Image:</label>
//       <input type="file" />
//     </div>
//   );
// };

// export default PostImageInput;
import React, { useEffect } from 'react';

const ImageInput = () => {


  return (
    <div>
      <label>사진 업로드</label>
      <input type="file" />
    </div>
  );
};

export default ImageInput;
