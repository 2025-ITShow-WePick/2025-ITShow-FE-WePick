import React, { useState, useEffect } from 'react';
import styles from '../styles/CreatePostPage.module.css'
import PhotoBoothCamera from '../components/PhotoBoothCamera'
import SuccessModal from './SuccessModal';

const PostImageInput = ({ value, onImageChange }) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  // value가 변경될 때 미리보기 업데이트
  useEffect(() => {
    if (value) {
      if (value instanceof File || value instanceof Blob) {
        const previewUrl = URL.createObjectURL(value);
        setImagePreview(previewUrl);

        // cleanup function으로 메모리 누수 방지
        return () => {
          URL.revokeObjectURL(previewUrl);
        };
      }
    } else {
      setImagePreview(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    console.log('파일 선택됨:', file);

    if (file) {
      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 검증 (예: 10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
      }

      onImageChange(file);
      setShowActionModal(false); // 모달 닫기
    }
  };

  // 사진찍기 버튼 클릭
  const handleTakePhoto = () => {
    setShowActionModal(false);
    setShowCameraModal(true);

    setTimeout(() => {
      setShowCameraModal(false);
      setShowCamera(true);
    }, 2000)
  };

  const handleCameraComplete = (result) => {
    console.log('📸 handleCameraComplete 호출됨:', result);

    // result 객체에서 blob 추출
    const photoBlob = result?.blob;

    if (!photoBlob) {
      console.error("📸 handleCameraComplete: blob이 없습니다!", result);
      return;
    }

    if (!(photoBlob instanceof Blob)) {
      console.error("📸 handleCameraComplete: photoBlob이 Blob 객체가 아닙니다!", typeof photoBlob, photoBlob);
      return;
    }

    try {
      // Blob을 File 객체로 변환 (업로드를 위해)
      const file = new File([photoBlob], 'camera-photo.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      onImageChange(file);
      setShowCamera(false);
    } catch (error) {
      console.error("📸 파일 변환 실패:", error);
    }
  };

  const handleMainInputClick = (e) => {
    e.preventDefault();
    setShowActionModal(true);
  };

  // 이미지 제거 함수
  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageChange(null);
  };

  return (
    <div className={styles.imageInputContainer}>
      {/* 이미지가 있을 때는 이미지만 표시 */}
      {imagePreview ? (
        <div className={styles.imagePreviewContainer}>
          <div className={styles.imageWrapper}>
            <img
              src={imagePreview}
              alt="미리보기"
              className={styles.previewImage}
            />

            <div className={styles.imageOverlay}>
              <button
                onClick={() => setShowActionModal(true)}
                className={`${styles.overlayButton} ${styles.changeButton}`}
              >
                변경
              </button>
              <button
                onClick={handleRemoveImage}
                className={`${styles.overlayButton} ${styles.removeButton}`}
              >
                제거
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 이미지가 없을 때만 업로드 박스 표시
        <>
          <p className={styles.uploadTitle}>사진 업로드</p>
          <div className={styles.uploadBox}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.uploadInput}
              id="fileUpload"
              style={{ display: 'none' }}
            />
            <label htmlFor="fileUpload" className={styles.uploadLabel} onClick={handleMainInputClick}>
              <span className={styles.plusIcon} >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="51" viewBox="0 0 50 22" fill="none">
                  <path d="M24.9292 0.5V50.5" stroke="black" strokeWidth="3" />
                  <path d="M0 25.4302L50 25.4302" stroke="black" strokeWidth="3" />
                </svg>
              </span>
              <span className={styles.uploadText}>인생 네컷 업로드하기</span>
            </label>
            {/* <span className={styles.cameraText}>(사진 찍기)</span> */}
          </div>
        </>
      )}

      {showActionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }} onClick={() => setShowActionModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            minWidth: '200px'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleTakePhoto}
              style={{
                padding: '15px',
                border: 'none',
                borderRadius: '10px',
                background: '#000',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              사진 찍기
            </button>

            {/* 파일 input을 직접 트리거 */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="galleryUpload"
            />
            <label
              htmlFor="galleryUpload"
              style={{
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                background: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'block'
              }}
            >
              갤러리에서 업로드
            </label>
          </div>
        </div>
      )}

      {/* // 사진찍기 대기 모달 */}
      <SuccessModal
        isVisible={showCameraModal}
        type="camera"
        onClose={() => setShowCameraModal(false)}
      />

      {showCamera && (
        <PhotoBoothCamera
          onComplete={handleCameraComplete}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

export default PostImageInput;