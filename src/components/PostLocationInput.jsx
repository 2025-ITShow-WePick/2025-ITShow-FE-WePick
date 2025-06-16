import React, { useEffect, useState, useRef } from 'react';
import styles from '../styles/CreatePostPage.module.css'
import InputWrapper from './InputWrapper';
import axios from 'axios';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

const PostLocationInput = ({ value, onChange }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [sdkError, setSdkError] = useState(false);

  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // 카테고리별 아이콘 매핑
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return '📍';

    const category = categoryName.toLowerCase();

    if (category.includes('음식점') || category.includes('카페') || category.includes('식당')) {
      return '🍽️';
    } else if (category.includes('숙박')) {
      return '🏨';
    } else if (category.includes('관광') || category.includes('명소')) {
      return '🏛️';
    } else if (category.includes('쇼핑') || category.includes('마트')) {
      return '🛒';
    } else if (category.includes('병원') || category.includes('의료')) {
      return '🏥';
    } else if (category.includes('학교') || category.includes('교육')) {
      return '🏫';
    } else if (category.includes('은행') || category.includes('금융')) {
      return '🏦';
    } else if (category.includes('주유소') || category.includes('자동차')) {
      return '⛽';
    } else if (category.includes('공원') || category.includes('자연')) {
      return '🌳';
    } else if (category.includes('문화') || category.includes('예술')) {
      return '🎭';
    } else if (category.includes('스포츠') || category.includes('운동')) {
      return '⚽';
    } else {
      return '📍';
    }
  };

  // PlaceImageComponent - 장소 이미지 또는 카테고리 아이콘 표시
  const PlaceImageComponent = ({ place, className }) => {
    return (
      <div className={className} style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
      }}>
        {getCategoryIcon(place?.category_name)}
      </div>
    );
  };

  // 카카오 SDK 로드 (개선된 버전)
  useEffect(() => {
    // 이미 로드된 경우 체크
    if (window.kakao && window.kakao.maps) {
      console.log('카카오 SDK 이미 로드됨');
      setKakaoLoaded(true);
      return;
    }

    // 기존 스크립트가 있는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    console.log('카카오 SDK 로딩 시작...');
    console.log('API Key:', KAKAO_API_KEY ? '설정됨' : '설정되지 않음');

    // API 키 확인
    if (!KAKAO_API_KEY) {
      console.error('카카오 API 키가 설정되지 않았습니다.');
      setSdkError(true);
      return;
    }

    // 스크립트 태그 생성
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log('카카오 스크립트 로드 완료, SDK 초기화 중...');

      // SDK 초기화
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('카카오 SDK 초기화 완료');
          setKakaoLoaded(true);
          setSdkError(false);
        });
      } else {
        console.error('카카오 객체를 찾을 수 없습니다.');
        setSdkError(true);
      }
    };

    script.onerror = (error) => {
      console.error('카카오 지도 SDK 로드 실패:', error);
      setSdkError(true);
    };

    document.head.appendChild(script);

    return () => {
      // 클린업 시 스크립트 제거하지 않음 (다른 컴포넌트에서 사용할 수 있음)
    };
  }, []);

  // 검색 모달이 열릴 때 입력 필드에 자동 포커스
  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showSearchModal]);

  // 실시간 검색을 위한 디바운스 효과
  useEffect(() => {
    if (query.trim() && showSearchModal) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        handleSearch();
      }, 300);
    } else if (!query.trim()) {
      setSearchResults([]);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, showSearchModal]);

  const handleSearch = () => {
    // SDK 로딩 상태 확인
    if (!kakaoLoaded) {
      alert('카카오 지도 SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (sdkError) {
      alert('카카오 지도 SDK 로드에 실패했습니다. 페이지를 새로고침 해주세요.');
      return;
    }

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      alert('카카오 지도 서비스를 사용할 수 없습니다.');
      return;
    }

    if (!query.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }

    setIsLoading(true);

    try {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(query, (data, status) => {
        setIsLoading(false);
        console.log('검색 결과:', status, data);

        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(data);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          setSearchResults([]);
        } else {
          console.error('검색 실패:', status);
          alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.error('검색 중 예외 발생:', error);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  // 장소 선택
  const handleSelectedPlace = async (place) => {
    setSelectedPlace(place);
    setSearchResults([]);
    setQuery('');
    setShowSearchModal(false);
    setShowDropdown(false);
    onChange(place.place_name);
  };

  // 메인 입력 필드 클릭 처리
  const handleMainInputClick = () => {
    if (selectedPlace) {
      setShowDropdown(!showDropdown);
    } else {
      if (sdkError) {
        alert('카카오 지도 SDK 로드에 실패했습니다. 페이지를 새로고침 해주세요.');
        return;
      }
      setShowSearchModal(true);
    }
  };

  // 장소 삭제
  const handleRemovePlace = () => {
    setSelectedPlace(null);
    setShowDropdown(false);
    onChange('');
  };

  // 지도 표시
  useEffect(() => {
    if (showMap && selectedPlace && kakaoLoaded && window.kakao && mapRef.current) {
      try {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(selectedPlace.y, selectedPlace.x),
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);

        // 마커 추가
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: new window.kakao.maps.LatLng(selectedPlace.y, selectedPlace.x)
        });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px">${selectedPlace.place_name}</div>`
        });
        infoWindow.open(map, marker);
      } catch (error) {
        console.error('지도 생성 실패:', error);
        alert('지도를 불러오는데 실패했습니다.');
        setShowMap(false);
      }
    }
  }, [showMap, selectedPlace, kakaoLoaded]);

  // Enter 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <InputWrapper label="위치(지점)">
      {/* SDK 로딩 상태 표시 */}
      {!kakaoLoaded && !sdkError && (
        <div style={{ padding: '10px', color: '#666', fontSize: '14px' }}>
          카카오 지도 SDK 로딩 중...
        </div>
      )}

      {sdkError && (
        <div style={{ padding: '10px', color: '#e74c3c', fontSize: '14px' }}>
          지도 서비스를 불러오는데 실패했습니다. 페이지를 새로고침 해주세요.
        </div>
      )}

      {/* 메인 입력 필드 */}
      <div className={styles.locationInputContainer}>
        <div className={`${styles.locationInputField} ${showDropdown ? styles.dropdownExpanded : ''}`} onClick={handleMainInputClick}>
          {!selectedPlace && (
            <>
              <span className={styles.placeholderText}>
                클릭해서 사진을 찍은 위치와 지점을 입력해 주세요.
              </span>
              <div className={styles.locationIcon}>
                <svg width="18" height="22" viewBox="0 0 18 27" fill="none">
                  <path d="M9 12.8571C8.14752 12.8571 7.32995 12.5185 6.72716 11.9157C6.12436 11.3129 5.78571 10.4953 5.78571 9.64282C5.78571 8.79034 6.12436 7.97277 6.72716 7.36998C7.32995 6.76718 8.14752 6.42854 9 6.42854C9.85248 6.42854 10.67 6.76718 11.2728 7.36998C11.8756 7.97277 12.2143 8.79034 12.2143 9.64282C12.2143 10.0649 12.1311 10.4829 11.9696 10.8729C11.8081 11.2629 11.5713 11.6172 11.2728 11.9157C10.9744 12.2141 10.62 12.4509 10.2301 12.6124C9.84008 12.774 9.42211 12.8571 9 12.8571ZM9 0.642822C6.61305 0.642822 4.32387 1.59103 2.63604 3.27886C0.948211 4.96669 0 7.25587 0 9.64282C0 16.3928 9 26.3571 9 26.3571C9 26.3571 18 16.3928 18 9.64282C18 7.25587 17.0518 4.96669 15.364 3.27886C13.6761 1.59103 11.3869 0.642822 9 0.642822Z" fill="#939393" />
                </svg>
              </div>
            </>
          )}

          {selectedPlace && (
            <>
              <div className={styles.locationIconAfter}>
                <svg width="18" height="22" viewBox="0 0 18 27" fill="none">
                  <path d="M9 12.8571C8.14752 12.8571 7.32995 12.5185 6.72716 11.9157C6.12436 11.3129 5.78571 10.4953 5.78571 9.64282C5.78571 8.79034 6.12436 7.97277 6.72716 7.36998C7.32995 6.76718 8.14752 6.42854 9 6.42854C9.85248 6.42854 10.67 6.76718 11.2728 7.36998C11.8756 7.97277 12.2143 8.79034 12.2143 9.64282C12.2143 10.0649 12.1311 10.4829 11.9696 10.8729C11.8081 11.2629 11.5713 11.6172 11.2728 11.9157C10.9744 12.2141 10.62 12.4509 10.2301 12.6124C9.84008 12.774 9.42211 12.8571 9 12.8571ZM9 0.642822C6.61305 0.642822 4.32387 1.59103 2.63604 3.27886C0.948211 4.96669 0 7.25587 0 9.64282C0 16.3928 9 26.3571 9 26.3571C9 26.3571 18 16.3928 18 9.64282C18 7.25587 17.0518 4.96669 15.364 3.27886C13.6761 1.59103 11.3869 0.642822 9 0.642822Z" fill="#939393" />
                </svg>
              </div>
              <div className={styles.selectedLocationText}>
                <h3 className={styles.placeName}>{selectedPlace.place_name}</h3>
              </div>
              <div
                className={`${styles.expandIcon} ${showDropdown ? styles.expanded : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
              >
                <svg width="28" height="16" viewBox="1 0 8 7" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="#939393" strokeWidth="1.3" />
                </svg>
              </div>
            </>
          )}
        </div>

        {/* 선택된 장소 상세 정보 드롭다운 */}
        {selectedPlace && showDropdown && (
          <div className={styles.dropdown}>
            <div className={styles.selectedPlaceInfo}>
              <div className={styles.placeImageContainer}>
                <PlaceImageComponent
                  place={selectedPlace}
                  className={styles.placeThumbnail}
                />
              </div>
              <div className={styles.placeDetails}>
                <h3 className={styles.placeName}>{selectedPlace.place_name}</h3>
                <p className={styles.placeAddress}>
                  {selectedPlace.road_address_name || selectedPlace.address_name}
                </p>
                <div className={styles.dropdownActions}>
                  <button
                    className={styles.viewMapButton}
                    onClick={() => setShowMap(true)}
                    disabled={!kakaoLoaded}
                  >
                    지점 확인하기
                  </button>
                  <button
                    className={styles.removeLocationButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePlace();
                    }}
                  >
                    위치 삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 검색 모달 */}
      {showSearchModal && (
        <div className={styles.searchModalOverlay} onClick={() => setShowSearchModal(false)}>
          <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.searchHeader}>
              <h2>위치 검색</h2>
              <button className={styles.closeButton}
                onClick={() => setShowSearchModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.searchInputContainer}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="장소명을 입력하세요"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.searchInput}
                disabled={!kakaoLoaded}
              />
              <button
                className={styles.searchButton}
                onClick={handleSearch}
                disabled={isLoading || !kakaoLoaded}
              >
                {isLoading ? '검색중...' : '검색'}
              </button>
            </div>

            <div className={styles.searchResults}>
              {searchResults.length > 0 ? (
                <ul className={styles.resultsList}>
                  {searchResults.map((place) => (
                    <li
                      key={place.id}
                      className={styles.resultItem}
                      onClick={() => handleSelectedPlace(place)}
                    >
                      <div className={styles.resultIcon}>
                        <PlaceImageComponent
                          place={place}
                          className={styles.resultPlaceImage}
                        />
                      </div>
                      <div className={styles.resultInfo}>
                        <div className={styles.resultName}>{place.place_name}</div>
                        <div className={styles.resultAddress}>
                          {place.road_address_name || place.address_name}
                        </div>
                        {place.category_name && (
                          <div className={styles.resultCategory}>{place.category_name}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : query && !isLoading ? (
                <div className={styles.noResults}>검색 결과가 없습니다.</div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 지도 모달 */}
      {showMap && selectedPlace && (
        <div className={styles.mapModalOverlay} onClick={() => setShowMap(false)}>
          <div className={styles.mapModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mapHeader}>
              <h3>{selectedPlace.place_name}</h3>
              <button className={styles.closeBtn} onClick={() => setShowMap(false)}>
                ✕
              </button>
            </div>
            <div ref={mapRef} className={styles.mapContainer}></div>
          </div>
        </div>
      )}
    </InputWrapper>
  );
};

export default PostLocationInput;