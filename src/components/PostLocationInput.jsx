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
      <input
        className={styles.defaultInput}
        type="text"
        onChange={e => onChange(e.target.value)}
        value={value}
        placeholder="클릭해서 사진을 찍은 위치와 지점을 입력해 주세요"
      />
    </InputWrapper>
  );
};

export default PostLocationInput;
