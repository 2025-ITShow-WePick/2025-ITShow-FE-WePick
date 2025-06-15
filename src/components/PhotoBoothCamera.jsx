import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './PhotoBoothCamera.module.css';
import Logo from './Logo'
import frame1 from '../assets/images/frame1.png';
import frame2 from '../assets/images/frame2.png';
import frame3 from '../assets/images/frame3.png';

const API_BASE_URL = 'http://localhost:3000';

export default function PhotoBoothCamera({ onComplete, onClose }) {
  const [currentStep, setCurrentStep] = useState('shooting'); // shooting, frameSelect
  const [currentShot, setCurrentShot] = useState(1);
  const [countdown, setCountdown] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [stream, setStream] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [frameImagesLoaded, setFrameImagesLoaded] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);

  // 프레임 옵션들
  const frameOptions = [
    { id: 1, name: '프레임 1', image: frame1 },
    { id: 2, name: '프레임 2', image: frame2 },
    { id: 3, name: '프레임 3', image: frame3 },
  ];

  // 프레임 이미지들 미리 로드
  useEffect(() => {
    const loadFrameImages = () => {
      let loadedCount = 0;
      const totalImages = frameOptions.length;

      frameOptions.forEach((frame) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setFrameImagesLoaded(true);
          }
        };
        img.src = frame.image;
      });
    };

    loadFrameImages();
  }, []);

  // 개별 사진을 백엔드에 업로드하는 함수
  const uploadPhoto = async (photoBlob, photoIndex) => {
    try {
      const formData = new FormData();
      formData.append('image', photoBlob, `photo_${photoIndex}.jpg`);

      const response = await axios.post(`${API_BASE_URL}/post/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error(`사진 ${photoIndex} 업로드 실패:`, error);
      console.log('전체 오류 정보:', error.response ?? error);
      throw error;
    }
  };

  // 카메라 스트림 시작
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('카메라 접근 실패:', err);
      alert('카메라에 접근할 수 없습니다.');
    }
  };

  // 카메라 스트림 정지
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // 사진 촬영
  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // 사진 데이터를 Blob으로 변환
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('❌ Blob 생성 실패: blob이 null입니다.');
        return;
      }

      const photoData = canvas.toDataURL('image/jpeg');

      try {
        // 개별 사진을 백엔드에 업로드 (선택사항)
        await uploadPhoto(blob, currentShot);

        setCapturedPhotos(prev => {
          const newPhotos = [...prev, photoData];

          if (newPhotos.length >= 4) {
            setTimeout(() => {
              stopCamera();
              setCurrentStep('frameSelect');
              setCountdown(null);
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
            }, 1500);
          } else {
            setCurrentShot(prev => prev + 1);
            setTimeout(() => {
              if (newPhotos.length < 4) {
                startCountdown();
              }
            }, 1500);
          }
          return newPhotos;
        });
      } catch (error) {
        console.error('사진 업로드 실패:', error);
        // 업로드 실패해도 촬영은 계속 진행
        setCapturedPhotos(prev => {
          const newPhotos = [...prev, photoData];
          // ... 나머지 로직 동일
          return newPhotos;
        });
      }
    }, 'image/jpeg', 0.9);

    setIsProcessing(false);
  };

  // 카운트다운 시작
  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setCountdown(5);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          setTimeout(() => {
            takePhoto();
            setCountdown(null);
          }, 1000);
          return 'SHOT!';
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 프레임 선택 완료 및 최종 업로드
  const handleFrameSelect = (frame) => {
    setSelectedFrame(frame);
    if (!frame || !frame.image) {
      console.error('프레임 객체 또는 image 속성이 없습니다:', frame);
      return;
    }
    const frameImg = new Image();
    frameImg.src = frame.image;

    const stripCanvas = document.createElement('canvas');
    const stripCtx = stripCanvas.getContext('2d');
    stripCanvas.width = 350;
    stripCanvas.height = 1200;


    frameImg.onload = () => {
      stripCtx.drawImage(frameImg, 0, 0, 350, 1200);

      let loadedCount = 0;
      capturedPhotos.forEach((photo, index) => {
        const img = new Image();
        img.onload = () => {
          stripCtx.drawImage(img, 25, 25 + (index * 260), 300, 250);
          loadedCount++;
          if (loadedCount === 4) {
            stripCanvas.toBlob(async (blob) => {
              if (blob) {
                onComplete({
                  blob,
                  frame: frame,
                  photos: capturedPhotos,
                });
              } else {
                console.error('❌ 4컷 스트립 Blob 생성 실패: null입니다.');
              }
            }, 'image/jpeg');
          }
        };
        img.src = photo;
      });
    };
  };

  useEffect(() => {
    if (currentStep === 'shooting') {
      startCamera();
      setTimeout(() => {
        startCountdown();
      }, 2000);
    }
  }, [currentStep]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  return (
    <div className={styles.cameraOverlay}>
      <div className={styles.cameraContainer}>
        {/* 촬영 화면 */}
        {currentStep === 'shooting' && (
          <div className={styles.shootingLayout}>
            <div className={styles.frameHeader}>
              <div className={styles.frameTitle}>
                <Logo size="small" />
                <button
                  className={styles.closeBtnCamera}
                  onClick={onClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="71" height="71" viewBox="0 0 71 71" fill="none">
                    <path d="M52.6631 17.5215L17.5215 52.6631" stroke="black" stroke-width="2" />
                    <path d="M17.6201 17.5215L52.7617 52.663" stroke="black" stroke-width="2" />
                  </svg>
                </button>
              </div>
              <p className={styles.frameSubtitle}>카메라를 응시해 주세요</p>
            </div>
            <div className={styles.mainContent}>
              <div className={styles.cameraView}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles.videoFeed}
                />
                {countdown && (
                  <div className={styles.countdownOverlay}>
                    <div className={styles.countdownText}>
                      {countdown}
                    </div>
                  </div>
                )}
                {!stream && (
                  <div className={styles.cameraPlaceholder}>
                    <p>카메라를 준비 중입니다...</p>
                  </div>
                )}

                {/* {countdown && (
                  <div className={styles.countdownOverlay}>
                    <div className={styles.countdownText}>
                      {countdown}
                    </div>
                  </div>
                )} */}
              </div>

              {/* 하단 사진 스트립 */}
              <div className={styles.photoStrip}>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className={styles.photoSlot}>
                    {capturedPhotos[i] ? (
                      <img src={capturedPhotos[i]} alt={`Photo ${i + 1}`} />
                    ) : (
                      <div className={styles.emptySlot}>
                        {i === currentShot - 1 && countdown ? (
                          <div className={styles.slotCountdown}>{countdown}</div>
                        ) : (
                          <div>{i + 1}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.shootingInfo}>
              <p>사진 찍기 위해 카메라 허용을 물으면 허용 버튼을 눌러주세요</p>
            </div>
          </div>
        )}

        {/* 프레임 선택 화면 */}
        {currentStep === 'frameSelect' && (
          <div className={styles.frameSelectScreen}>
            <div className={styles.frameHeader}>
              <div className={styles.frameTitle}>
                <Logo size="small" />
                <button
                  className={styles.closeBtn}
                  onClick={onClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="71" height="71" viewBox="0 0 71 71" fill="none">
                    <path d="M52.6631 17.5215L17.5215 52.6631" stroke="black" stroke-width="2" />
                    <path d="M17.6201 17.5215L52.7617 52.663" stroke="black" stroke-width="2" />
                  </svg>
                </button>
              </div>
              <p className={styles.frameSubtitle}>원하는 네컷 프레임을 선택해주세요</p>
            </div>

            <div className={styles.frameSelection}>
              {/* 좌측 화살표 */}
              {/* <button className={`${styles.navArrow} ${styles.leftArrow}`}>
                ‹
              </button> */}

              <div className={styles.frameContent}>
                {/* 프레임 옵션들 */}
                <div className={styles.frameOptions}>
                  {frameOptions.slice(0, 3).map((frame) => (
                    <div
                      key={frame.id}
                      className={`${styles.frameOption} ${frame.id === 2 ? styles.frame2slot : ''}`}
                      onClick={() => handleFrameSelect(frame)}
                    >
                      <img src={frame.image} alt={frame.name} style={{ width: '150px', height: 'auto' }} />
                      {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className={styles.frameSlot}></div>
                      ))}

                    </div>
                  ))}
                </div>
              </div>

              {/* 우측 화살표 */}
              {/* <button className={`${styles.navArrow} ${styles.rightArrow}`}>
                ›
              </button> */}
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className={styles.hidden} />
      </div>
    </div >
  );
}

// export { PostLocationInput };