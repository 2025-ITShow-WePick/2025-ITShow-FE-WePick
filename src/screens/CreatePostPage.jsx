import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios'; // Add this import
import { uploadImage, savePost } from '../services/api';
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

const API_BASE_URL = 'http://localhost:3000';
const EXISTING_USER_ID = "684cfa6c0811356c21e5c21c";


const CreatePostPage = () => {

    useEffect(() => {
        console.time('CreatePostPage 렌더링');
        return () => {
            console.timeEnd('CreatePostPage 렌더링');
        };
    }, []);

    const [formData, setFormData] = useState({
        image: null,
        location: '',
        date: '',
        memo: '',
        tags: [],
        name: '', // 유저 이름 (선택적)
    });

    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);


    const navigate = useNavigate();
    const handleCancel = () => {
        navigate("/"); // SplashPage 경로로 이동
    };

    const handleUploadToSearch = () => {
        navigate('/search');
    };
    // formData 상태를 업데이트
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // 위치 검색 함수 - Kakao JavaScript SDK 사용
    const handleLocationSearch = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Vite 환경변수에서 API 키 가져오기
            const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

            if (!KAKAO_API_KEY) {
                console.error('Kakao API 키가 설정되지 않았습니다.');
                setSearchResults([]);
                return;
            }

            // Kakao SDK가 로드되었는지 확인
            if (!window.kakao || !window.kakao.maps) {
                console.error('Kakao Maps SDK가 로드되지 않았습니다.');
                setSearchResults([]);
                return;
            }

            // Kakao Maps SDK 초기화 (한 번만 실행)
            if (!window.kakao.maps.services) {
                window.kakao.maps.load(() => {
                    // SDK 로드 완료 후 검색 실행
                    performKakaoSearch(searchTerm);
                });
            } else {
                // 이미 로드된 경우 바로 검색 실행
                performKakaoSearch(searchTerm);
            }

        } catch (error) {
            console.error('위치 검색 실패:', error);
            setSearchResults([]);
            setIsSearching(false);
        }
    };



    // Kakao 장소 검색 실행 함수
    const performKakaoSearch = (searchTerm) => {
        const places = new window.kakao.maps.services.Places();

        places.keywordSearch(searchTerm, (result, status) => {
            setIsSearching(false);

            if (status === window.kakao.maps.services.Status.OK) {
                // 검색 결과를 PostLocationInput에서 사용할 수 있는 형태로 변환
                const formattedResults = result.map(place => ({
                    place_name: place.place_name,
                    address_name: place.address_name,
                    road_address_name: place.road_address_name,
                    id: place.id,
                    phone: place.phone,
                    category_name: place.category_name,
                    x: place.x, // 경도
                    y: place.y  // 위도
                }));

                setSearchResults(formattedResults);
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                console.log('검색 결과가 없습니다.');
                setSearchResults([]);
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                console.error('검색 중 오류가 발생했습니다.');
                setSearchResults([]);
            }
        });
    };

    // 업로드 처리 함수
    const handleUpload = async () => {
        try {
            // 필수 필드 검증
            if (!formData.image) {
                alert('이미지를 선택해주세요.');
                return;
            }
            if (!formData.location.trim()) {
                alert('위치를 입력해주세요.');
                return;
            }
            if (!formData.date) {
                alert('날짜를 선택해주세요.');
                return;
            }

            setIsLoading(true);

            // 2. 이미지 업로드
            console.log('이미지 업로드 시작...');
            console.log('업로드할 이미지:', {
                name: formData.image.name,
                size: formData.image.size,
                type: formData.image.type
            });


            // 이미지가 Blob인지 File인지 확인
            if (!(formData.image instanceof File) && !(formData.image instanceof Blob)) {
                throw new Error('유효하지 않은 이미지 파일입니다.');
            }

            const uploadResult = await uploadImage(formData.image);
            console.log('이미지 업로드 응답:', uploadResult);

            // 응답 구조 확인 및 URL 추출
            let imageUrl;
            if (uploadResult && uploadResult.data) {
                imageUrl = uploadResult.data; // 백엔드에서 data 필드에 URL 반환
            } else if (typeof uploadResult === 'string') {
                imageUrl = uploadResult;
            }

            if (!imageUrl) {
                console.error('이미지 URL을 찾을 수 없습니다. 업로드 응답:', uploadResult);
                throw new Error('이미지 업로드는 완료되었지만 URL을 받을 수 없습니다.');
            }

            console.log('이미지 업로드 완료:', imageUrl);

            // 3. 게시물 데이터 준비 - MongoDB 스키마에 맞게
            const postData = {
                user: EXISTING_USER_ID,
                imageUrl,
                location: formData.location,
                date: new Date(formData.date), // Date 객체로 변환
                memo: formData.memo || '',
                tags: formData.tags, // 이미 배열이어야 함
            };

            console.log('게시물 저장 시작...', postData);

            // 4. 게시물 저장
            const result = await savePost(postData);

            console.log('게시물 저장 성공:', result);
            alert('게시물이 성공적으로 업로드되었습니다!');
            navigate('/search');
            // 성공 시 폼 초기화
            resetForm();

        } catch (error) {
            console.error('업로드 실패:', error);

            // 더 자세한 오류 처리
            if (error.response) {
                // 서버가 오류 상태로 응답한 경우
                console.error('서버 응답 오류:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });

                const errorMessage = error.response.data?.message ||
                    error.response.data?.error ||
                    `서버 오류 (${error.response.status})`;
                alert(`서버 오류: ${errorMessage}`);

            } else if (error.request) {
                // 요청은 했지만 응답을 받지 못한 경우
                console.error('네트워크 오류 - 요청:', error.request);
                console.error('요청 설정:', error.config);
                alert('서버에 연결할 수 없습니다. 네트워크 연결과 서버 상태를 확인해주세요.');

            } else {
                // 기타 오류
                console.error('오류 상세:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });
                alert(`업로드 중 오류가 발생했습니다: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 폼 초기화
    const resetForm = () => {
        setFormData({
            image: null,
            location: '',
            date: '',
            memo: '',
            tags: [],
            name: '',
        });
        setSearchResults([]);
    };



    return (
        <div>
            <Logo />
            <div className={styles.header}>
                <h2 className={styles.postTitle}>게시물 작성</h2>
                <button
                    className={styles.cancelButton}
                    onClick={handleCancel}
                    disabled={isLoading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="71" height="71" viewBox="0 0 71 71" fill="none">
                        <path d="M52.6631 17.5215L17.5215 52.6631" stroke="black" stroke-width="2" />
                        <path d="M17.6201 17.5215L52.7617 52.663" stroke="black" stroke-width="2" />
                    </svg>
                </button>
            </div>
            <div className={styles.inputContainer}>
                <div className={styles.postInputContainer}>
                    <PostImageInput
                        value={formData.image}
                        onImageChange={(file) => handleInputChange('image', file)}
                    />
                </div>
                <div className={styles.rightPostInputGroup}>
                    <PostLocationInput
                        value={formData.location}
                        onChange={value => {
                            handleInputChange('location', value)
                            handleLocationSearch(value);
                        }}
                        searchResults={searchResults}        // 검색 결과 데이터 전달
                        onSelectLocation={location => {
                            handleInputChange('location', location.place_name);  // 선택된 장소명 저장
                            setSearchResults([]);  // 선택 후 검색 결과 초기화 (결과 숨김)
                        }}
                        isSearching={isSearching}
                    />
                    <PostDateInput
                        value={formData.date}
                        onChange={value => handleInputChange('date', value)}
                    />
                    <PostMemoInput
                        memoValue={formData.memo}
                        onChange={value => handleInputChange('memo', value)}
                    />
                    <PostTagInput
                        tagValue={formData.tags}
                        onChange={tagArray => handleInputChange('tags', tagArray)}
                    />

                    {/* <div className={styles.buttonContainer}>
                        <button onClick={onClick} className={styles.button}>
                            업로드
                        </button>
                    </div> */}
                    <div className={styles.uploadButtonContainer}>
                        <button
                            className={styles.uploadButton}
                            onClick={handleUpload}
                            disabled={isLoading || !formData.image}
                        >
                            {isLoading ? '업로드 중...' : '게시물 업로드'}
                        </button>


                    </div>
                </div>
            </div>
            {/* 개발용 디버그 정보 */}
            {process.env.NODE_ENV === 'development' && (
                <div className={styles.debugInfo}>
                    <h3>현재 입력된 데이터:</h3>
                    <pre>
                        {JSON.stringify({
                            image: formData.image ? formData.image.name : null,
                            location: formData.location,
                            date: formData.date,
                            memo: formData.memo,
                            tags: formData.tags
                        }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default CreatePostPage;