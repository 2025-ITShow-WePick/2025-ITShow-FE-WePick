import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/CreatePostPage.module.css";
import InputWrapper from "./InputWrapper";
import axios from "axios";

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

const PostLocationInput = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null); // 초기값을 null로 변경
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false); // API 쿼터 상태 추가

  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // 미림마이스터고 고정 데이터
  const FALLBACK_PLACE = {
    id: "fixed_mirim",
    place_name: "미림마이스터고등학교",
    address_name: "서울특별시 관악구 호암로 546",
    road_address_name: "서울특별시 관악구 호암로 546",
    category_name: "학교 > 고등학교",
    x: "126.9515135",
    y: "37.4776871",
  };

  // 카테고리별 아이콘 매핑
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return "📍";

    const category = categoryName.toLowerCase();

    if (
      category.includes("음식점") ||
      category.includes("카페") ||
      category.includes("식당")
    ) {
      return "🍽️";
    } else if (category.includes("숙박")) {
      return "🏨";
    } else if (category.includes("관광") || category.includes("명소")) {
      return "🏛️";
    } else if (category.includes("쇼핑") || category.includes("마트")) {
      return "🛒";
    } else if (category.includes("병원") || category.includes("의료")) {
      return "🏥";
    } else if (category.includes("학교") || category.includes("교육")) {
      return "🏫";
    } else if (category.includes("은행") || category.includes("금융")) {
      return "🏦";
    } else if (category.includes("주유소") || category.includes("자동차")) {
      return "⛽";
    } else if (category.includes("공원") || category.includes("자연")) {
      return "🌳";
    } else if (category.includes("문화") || category.includes("예술")) {
      return "🎭";
    } else if (category.includes("스포츠") || category.includes("운동")) {
      return "⚽";
    } else {
      return "📍";
    }
  };

  // PlaceImageComponent - 장소 이미지 또는 카테고리 아이콘 표시
  const PlaceImageComponent = ({ place, className }) => {
    return (
      <div
        className={className}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}
      >
        {getCategoryIcon(place?.category_name)}
      </div>
    );
  };

  // 카카오 SDK 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      console.log("카카오 SDK 이미 로드됨");
      setKakaoLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    console.log("카카오 SDK 로딩 시작...");

    if (!KAKAO_API_KEY) {
      console.error("카카오 API 키가 설정되지 않았습니다.");
      setSdkError(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log("카카오 스크립트 로드 완료, SDK 초기화 중...");

      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log("카카오 SDK 초기화 완료");
          setKakaoLoaded(true);
          setSdkError(false);
        });
      } else {
        console.error("카카오 객체를 찾을 수 없습니다.");
        setSdkError(true);
      }
    };

    script.onerror = (error) => {
      console.error("카카오 지도 SDK 로드 실패:", error);
      setSdkError(true);
    };

    document.head.appendChild(script);
  }, []);

  // 검색 기능 (정상 버전)
  const searchPlaces = async (searchQuery) => {
    if (!kakaoLoaded || !window.kakao || !searchQuery.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const places = new window.kakao.maps.services.Places();

      places.keywordSearch(searchQuery, (data, status, pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log("검색 성공:", data);
          setSearchResults(data);
          setQuotaExceeded(false); // 성공 시 쿼터 정상으로 설정
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          console.log("검색 결과 없음");
          setSearchResults([]);
        } else if (status === window.kakao.maps.services.Status.ERROR) {
          console.error("검색 에러 - API 쿼터 초과 가능성");
          // 쿼터 초과로 판단하고 fallback 모드로 전환
          setQuotaExceeded(true);
          setSelectedPlace(FALLBACK_PLACE);
          onChange("location", FALLBACK_PLACE.place_name);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error("검색 중 에러:", error);
      // 에러 발생 시에도 쿼터 초과로 판단
      setQuotaExceeded(true);
      setSelectedPlace(FALLBACK_PLACE);
      onChange("location", FALLBACK_PLACE.place_name);
      setIsLoading(false);
    }
  };

  // 디바운스된 검색
  const debouncedSearch = (searchQuery) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchPlaces(searchQuery);
    }, 300);
  };

  // 검색어 변경 핸들러
  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim()) {
      debouncedSearch(newQuery);
    } else {
      setSearchResults([]);
    }
  };

  // 검색 실행
  const handleSearch = () => {
    if (quotaExceeded) {
      alert("현재 카카오 API 한도 초과로 임시 고정 장소를 사용 중입니다.");
      return;
    }

    if (query.trim()) {
      searchPlaces(query);
    }
  };

  // 장소 선택
  const handleSelectedPlace = async (place) => {
    setSelectedPlace(place);
    onChange("location", place.place_name);
    setShowSearchModal(false);
    setQuery("");
    setSearchResults([]);
  };

  // 메인 입력 필드 클릭 처리
  const handleMainInputClick = () => {
    if (quotaExceeded) {
      alert("현재 카카오 API 한도 초과로 검색 기능이 비활성화되었습니다.");
      return;
    }

    if (selectedPlace) {
      setShowDropdown(!showDropdown);
    } else {
      setShowSearchModal(true);
    }
  };

  // 장소 삭제
  const handleRemovePlace = () => {
    if (quotaExceeded) {
      alert("현재는 고정 장소를 사용 중입니다.");
      return;
    }

    setSelectedPlace(null);
    onChange("location", "");
    setShowDropdown(false);
  };

  // 지도 표시
  useEffect(() => {
    if (
      showMap &&
      selectedPlace &&
      kakaoLoaded &&
      window.kakao &&
      mapRef.current
    ) {
      try {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(
            selectedPlace.y,
            selectedPlace.x
          ),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        const marker = new window.kakao.maps.Marker({
          map: map,
          position: new window.kakao.maps.LatLng(
            selectedPlace.y,
            selectedPlace.x
          ),
        });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px">${selectedPlace.place_name}</div>`,
        });
        infoWindow.open(map, marker);
      } catch (error) {
        console.error("지도 생성 실패:", error);
        alert("지도를 불러오는데 실패했습니다.");
        setShowMap(false);
      }
    }
  }, [showMap, selectedPlace, kakaoLoaded]);

  // Enter 키 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <InputWrapper label="위치(지점)">
      {/* 쿼터 초과 시에만 경고 메시지 표시 */}
      {quotaExceeded && (
        <div
          style={{
            padding: "10px",
            color: "#e67e22",
            fontSize: "14px",
            backgroundColor: "#fef5e7",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          ⚠️ 현재 카카오 API 한도 초과로 임시 고정
          장소("미림마이스터고등학교")를 사용 중입니다.
        </div>
      )}

      {/* 메인 입력 필드 */}
      <div className={styles.locationInputContainer}>
        <div
          className={`${styles.locationInputField} ${
            showDropdown ? styles.dropdownExpanded : ""
          }`}
          onClick={handleMainInputClick}
        >
          {selectedPlace ? (
            <>
              <div className={styles.locationIconAfter}>
                <svg width="18" height="22" viewBox="0 0 18 27" fill="none">
                  <path
                    d="M9 12.8571C8.14752 12.8571 7.32995 12.5185 6.72716 11.9157C6.12436 11.3129 5.78571 10.4953 5.78571 9.64282C5.78571 8.79034 6.12436 7.97277 6.72716 7.36998C7.32995 6.76718 8.14752 6.42854 9 6.42854C9.85248 6.42854 10.67 6.76718 11.2728 7.36998C11.8756 7.97277 12.2143 8.79034 12.2143 9.64282C12.2143 10.0649 12.1311 10.4829 11.9696 10.8729C11.8081 11.2629 11.5713 11.6172 11.2728 11.9157C10.9744 12.2141 10.62 12.4509 10.2301 12.6124C9.84008 12.774 9.42211 12.8571 9 12.8571ZM9 0.642822C6.61305 0.642822 4.32387 1.59103 2.63604 3.27886C0.948211 4.96669 0 7.25587 0 9.64282C0 16.3928 9 26.3571 9 26.3571C9 26.3571 18 16.3928 18 9.64282C18 7.25587 17.0518 4.96669 15.364 3.27886C13.6761 1.59103 11.3869 0.642822 9 0.642822Z"
                    fill="#939393"
                  />
                </svg>
              </div>
              <div className={styles.selectedLocationText}>
                <h3 className={styles.placeName}>{selectedPlace.place_name}</h3>
              </div>
              <div
                className={`${styles.expandIcon} ${
                  showDropdown ? styles.expanded : ""
                }`}
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
          ) : (
            <div className={styles.placeholderText}>위치를 검색해주세요</div>
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
                  {selectedPlace.road_address_name ||
                    selectedPlace.address_name}
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
                    disabled={quotaExceeded}
                  >
                    {quotaExceeded ? "위치 삭제 (비활성화)" : "위치 삭제"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 검색 모달 */}
      {showSearchModal && !quotaExceeded && (
        <div
          className={styles.searchModalOverlay}
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className={styles.searchModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.searchHeader}>
              <h3>위치 검색</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowSearchModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.searchInputContainer}>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder="검색할 장소명을 입력해주세요"
                className={styles.searchInput}
                autoFocus
              />
              <button
                onClick={handleSearch}
                className={styles.searchButton}
                disabled={isLoading}
              >
                {isLoading ? "검색 중..." : "검색"}
              </button>
            </div>

            {/* 검색 결과 */}
            <div className={styles.searchResults}>
              {isLoading && (
                <div className={styles.loadingState}>검색 중...</div>
              )}

              {!isLoading && searchResults.length === 0 && query && (
                <div className={styles.noResults}>검색 결과가 없습니다.</div>
              )}

              {!isLoading &&
                searchResults.map((place, index) => (
                  <div
                    key={`${place.id}-${index}`}
                    className={styles.searchResultItem}
                    onClick={() => handleSelectedPlace(place)}
                  >
                    <div className={styles.placeImageContainer}>
                      <PlaceImageComponent
                        place={place}
                        className={styles.placeThumbnail}
                      />
                    </div>
                    <div className={styles.placeInfo}>
                      <h4 className={styles.placeName}>{place.place_name}</h4>
                      <p className={styles.placeAddress}>
                        {place.road_address_name || place.address_name}
                      </p>
                      {place.category_name && (
                        <p className={styles.placeCategory}>
                          {place.category_name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 지도 모달 */}
      {showMap && selectedPlace && (
        <div
          className={styles.mapModalOverlay}
          onClick={() => setShowMap(false)}
        >
          <div className={styles.mapModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mapHeader}>
              <h3>{selectedPlace.place_name}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowMap(false)}
              >
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
