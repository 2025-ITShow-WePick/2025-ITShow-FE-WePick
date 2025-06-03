import React, { useEffect, useState } from 'react';
import styles from '../styles/CreatePostPage.module.css'

import InputWrapper from './InputWrapper';
const PostLocationInput = ({ value, onChange }) => {
  // const [scriptLoaded, setScriptLoaded] = useState(false);
  // const [kakaoMap, setKakaoMap] = useState(null);

  // // 카카오 맵 API 스크립트 로드
  // useEffect(() => {
  //   // 이미 로드된 경우 반복해서 로드하지 않도록 처리
  //   if (window.kakao) {
  //     setScriptLoaded(true);
  //     setKakaoMap(window.kakao); // 카카오 맵 객체 저장
  //     return;
  //   }

  //   const script = document.createElement('script');
  //   script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=1d5a9af109b1848c865378c1aad650f9&libraries=services&autoload=true`;
  //   script.async = true;
  //   script.onload = () => {
  //     setScriptLoaded(true);
  //     setKakaoMap(window.kakao); // 카카오 맵 객체 저장
  //   };
  //   script.onerror = (e) => {
  //     debugger
  //     console.error('카카오 맵 스크립트 로드에 실패했습니다.')
  //     console.log(e)
  //   };
  //   document.head.appendChild(script);

  //   return () => {
  //     document.head.removeChild(script); // 컴포넌트가 unmount될 때 스크립트 제거
  //   };
  // }, []);

  // // 스크립트가 로드된 후에 카카오 맵 관련 작업 수행
  // useEffect(() => {
  //   if (scriptLoaded && kakaoMap) {
  //     console.log('카카오 맵 스크립트가 로드되었습니다.');
  //     // 여기에서 카카오 맵 관련 작업을 진행
  //   }
  // }, [scriptLoaded, kakaoMap]);

  return (
    <InputWrapper label={"위치(지점)"}>
      <div className={styles.inputWithIcon}>
        <input
          className={styles.defaultInput}
          type="text"
          onChange={e => onChange(e.target.value)}
          value={value}
          placeholder="클릭해서 사진을 찍은 위치와 지점을 입력해 주세요"
        />
        <span className={styles.inputIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 27" fill="none">
            <path d="M9 12.8571C8.14752 12.8571 7.32995 12.5185 6.72716 11.9157C6.12436 11.3129 5.78571 10.4953 5.78571 9.64282C5.78571 8.79034 6.12436 7.97277 6.72716 7.36998C7.32995 6.76718 8.14752 6.42854 9 6.42854C9.85248 6.42854 10.67 6.76718 11.2728 7.36998C11.8756 7.97277 12.2143 8.79034 12.2143 9.64282C12.2143 10.0649 12.1311 10.4829 11.9696 10.8729C11.8081 11.2629 11.5713 11.6172 11.2728 11.9157C10.9744 12.2141 10.62 12.4509 10.2301 12.6124C9.84008 12.774 9.42211 12.8571 9 12.8571ZM9 0.642822C6.61305 0.642822 4.32387 1.59103 2.63604 3.27886C0.948211 4.96669 0 7.25587 0 9.64282C0 16.3928 9 26.3571 9 26.3571C9 26.3571 18 16.3928 18 9.64282C18 7.25587 17.0518 4.96669 15.364 3.27886C13.6761 1.59103 11.3869 0.642822 9 0.642822Z" fill="#939393" />
          </svg>
        </span>
      </div>
    </InputWrapper>
  );
};

export default PostLocationInput;
