import React, { useRef, useState, useEffect } from "react";
import styles from "../styles/SearchPageDetail.module.css";
import Logo from "../components/Logo";
import FieldBox from "../components/FieldBox";
import MemoBox from "../components/MemoBox";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SearchPageDetail() {
  const containerRefs = useRef([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const indexParam = searchParams.get("index");
  const idParam = searchParams.get("id"); // 🔥 ID 파라미터 추가

  // API에서 가져온 게시물 데이터
  const [searchView, setSearchView] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 터치패드 제스처를 위한 상태
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastWheelTime, setLastWheelTime] = useState(0);
  const [lastKeyTime, setLastKeyTime] = useState(0);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // API에서 게시물 데이터 가져오기
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        console.log("API 호출 시작...");

        const response = await fetch("/api/post");
        console.log("API 응답 상태:", response.status);

        if (!response.ok) {
          throw new Error("게시물을 불러올 수 없습니다.");
        }

        const responseData = await response.json();
        console.log("API 응답 데이터:", responseData);

        // API 응답 구조에 따라 데이터 처리
        let postsData;
        if (Array.isArray(responseData.data)) {
          postsData = responseData.data; // 배열인 경우
          console.log("배열 데이터:", postsData);
        } else if (responseData.data) {
          postsData = [responseData.data]; // 객체인 경우 배열로 감싸기
          console.log("객체를 배열로 변환:", postsData);
        } else {
          postsData = []; // 데이터 없음
          console.log("데이터 없음");
        }

        const formattedPosts = postsData.map((post, index) => ({
          index: index,
          id: post.id, // 🔥 게시물 고유 ID 저장
          src: post.imageUrl || "/fallback.jpg",
          place: post.location || "위치 정보 없음",
          date: formatDate(post.date),
          memo: post.memo || "메모 없음",
        }));

        console.log("포맷된 데이터:", formattedPosts);
        setSearchView(formattedPosts);
      } catch (err) {
        console.error("게시물 데이터 가져오기 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, []);

  // 새로고침 감지
  useEffect(() => {
    const isActualReload = () => {
      if (performance && performance.getEntriesByType) {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          return (
            navEntries[0].type === "reload" &&
            (document.referrer === "" ||
              document.referrer === window.location.href)
          );
        }
      }

      const navigationStart = performance.getEntriesByType("navigation")[0];
      return navigationStart && navigationStart.type === "reload";
    };

    // 실제 새로고침일 때만 첫 번째 게시물로 이동
    if (isActualReload() && !indexParam && !idParam && searchView.length > 0) {
      navigate("/searchdetail?index=0", { replace: true });
    }
  }, [navigate, indexParam, idParam, searchView]);

  // 현재 인덱스 설정 - ID 우선, 없으면 index 사용
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (idParam && searchView.length > 0) {
      // ID로 게시물 찾기
      const foundIndex = searchView.findIndex((post) => post.id === idParam);
      return foundIndex >= 0 ? foundIndex : 0;
    }
    const idx = indexParam ? parseInt(indexParam) : 0;
    return idx >= 0 ? idx : 0;
  });

  useEffect(() => {
    if (searchView.length > 0) {
      let targetIndex = 0;

      if (idParam) {
        // ID로 게시물 찾기
        const foundIndex = searchView.findIndex((post) => post.id === idParam);
        targetIndex = foundIndex >= 0 ? foundIndex : 0;
      } else if (indexParam) {
        // index로 게시물 찾기
        const idx = parseInt(indexParam);
        targetIndex = idx >= 0 && idx < searchView.length ? idx : 0;
      }

      if (targetIndex !== currentIndex) {
        setCurrentIndex(targetIndex);
      }
    }
  }, [indexParam, idParam, searchView]);

  useEffect(() => {
    const ref = containerRefs.current[currentIndex];
    const container = ref?.parentNode;
    if (container && ref) {
      container.scrollTo({
        left: ref.offsetLeft,
        top: container.scrollTop,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  // 초기 로딩 시 해당 인덱스의 카드로 즉시 이동
  useEffect(() => {
    if (searchView.length > 0) {
      const timer = setTimeout(() => {
        const ref = containerRefs.current[currentIndex];
        const container = ref?.parentNode;
        if (container && ref) {
          container.scrollTo({
            left: ref.offsetLeft,
            top: container.scrollTop,
            behavior: "auto",
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, searchView]);

  const handleNext = () => {
    if (searchView.length === 0) return;

    if (currentIndex < searchView.length - 1) {
      navigate(`/searchdetail?index=${currentIndex + 1}`);
    } else {
      navigate(`/searchdetail?index=0`);
    }
  };

  const handlePrevious = () => {
    if (searchView.length === 0) return;

    if (currentIndex > 0) {
      navigate(`/searchdetail?index=${currentIndex - 1}`);
    } else {
      navigate(`/searchdetail?index=${searchView.length - 1}`);
    }
  };

  // 터치패드 제스처 이벤트 핸들러들
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
      setIsScrolling(false);
    }
  };

  const handleTouchMove = (e) => {
    if (!touchStart.x || !touchStart.y) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStart.x - currentX;
    const diffY = touchStart.y - currentY;

    if (Math.abs(diffY) > Math.abs(diffX)) {
      setIsScrolling(true);
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.x || !touchStart.y || isScrolling) {
      setTouchStart({ x: 0, y: 0 });
      setIsScrolling(false);
      return;
    }

    const currentX = e.changedTouches[0].clientX;
    const diffX = touchStart.x - currentX;
    const minSwipeDistance = 80;

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }

    setTouchStart({ x: 0, y: 0 });
    setIsScrolling(false);
  };

  const handleWheel = (e) => {
    const now = Date.now();
    const wheelCooldown = 800;

    if (now - lastWheelTime < wheelCooldown) {
      return;
    }

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
      e.preventDefault();
      setLastWheelTime(now);

      if (e.deltaX > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  const handleKeyDown = (e) => {
    const now = Date.now();
    const keyCooldown = 300;

    if (now - lastKeyTime < keyCooldown) {
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setLastKeyTime(now);
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setLastKeyTime(now);
      handleNext();
    }
  };

  // 이벤트 리스너 등록
  useEffect(() => {
    if (searchView.length > 0) {
      const timer = setTimeout(() => {
        const ref = containerRefs.current[currentIndex];
        const container = ref?.parentNode;
        if (container && ref) {
          container.scrollTo({
            left: ref.offsetLeft,
            top: container.scrollTop,
            behavior: "auto",
          });
        }
      }, 50);

      const container = document.querySelector(`.${styles.content}`);
      if (container) {
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, {
          passive: true,
        });
        container.addEventListener("touchmove", handleTouchMove, {
          passive: true,
        });
        container.addEventListener("touchend", handleTouchEnd, {
          passive: true,
        });
      }

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(timer);
        if (container) {
          container.removeEventListener("wheel", handleWheel);
          container.removeEventListener("touchstart", handleTouchStart);
          container.removeEventListener("touchmove", handleTouchMove);
          container.removeEventListener("touchend", handleTouchEnd);
        }
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [currentIndex, searchView]);

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.container}>
        <Logo />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            fontSize: "18px",
            color: "#666",
          }}
        >
          게시물을 불러오는 중...
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container}>
        <Logo />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            fontSize: "18px",
            color: "#ff6b6b",
          }}
        >
          오류: {error}
        </div>
      </div>
    );
  }

  // 게시물이 없는 경우
  if (searchView.length === 0) {
    return (
      <div className={styles.container}>
        <Logo />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            fontSize: "18px",
            color: "#666",
          }}
        >
          게시물이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Logo />
      <div className={styles.content}>
        {searchView.map((currentResult, i) => (
          <div
            key={currentResult.index} // 🔥 기존 index를 key로 사용 (애니메이션 유지)
            style={{
              display: "flex",
              width: "1256px",
              height: "788px",
              paddingLeft: i === 0 ? "320px" : "390px",
              marginRight: i === searchView.length - 1 ? "100vw" : 0,
              transition: "opacity 0.3s",
              opacity:
                i === currentIndex ? 1 : i === currentIndex + 1 ? 0.6 : 1,
              pointerEvents: i === currentIndex ? "auto" : "none",
            }}
            ref={(el) => (containerRefs.current[i] = el)}
          >
            <div className={styles.left}>
              <img
                src={currentResult.src}
                alt="게시물 이미지"
                className={styles.photo}
                onError={(e) => {
                  e.target.src = "/fallback.jpg";
                }}
              />
            </div>
            <div className={styles.right}>
              <FieldBox
                label="위치(지점)"
                value={currentResult.place}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="20"
                    viewBox="0 0 18 27"
                    fill="none"
                  >
                    <path
                      d="M9 12.8571C8.14752 12.8571 7.32995 12.5185 6.72716 11.9157C6.12436 11.3129 5.78571 10.4953 5.78571 9.64285C5.78571 8.79037 6.12436 7.97281 6.72716 7.37001C7.32995 6.76721 8.14752 6.42857 9 6.42857C9.85248 6.42857 10.67 6.76721 11.2728 7.37001C11.8756 7.97281 12.2143 8.79037 12.2143 9.64285C12.2143 10.065 12.1311 10.4829 11.9696 10.8729C11.8081 11.2629 11.5713 11.6172 11.2728 11.9157C10.9744 12.2142 10.62 12.4509 10.2301 12.6125C9.84008 12.774 9.42211 12.8571 9 12.8571ZM9 0.642853C6.61305 0.642853 4.32387 1.59106 2.63604 3.27889C0.948211 4.96672 0 7.25591 0 9.64285C0 16.3929 9 26.3571 9 26.3571C9 26.3571 18 16.3929 18 9.64285C18 7.25591 17.0518 4.96672 15.364 3.27889C13.6761 1.59106 11.3869 0.642853 9 0.642853Z"
                      fill="#939393"
                    />
                  </svg>
                }
              />
              <FieldBox
                label="날짜"
                value={currentResult.date}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 26 25"
                    fill="none"
                  >
                    <path
                      d="M23.6379 25H3.16675C1.85974 25 0.804688 23.9531 0.804688 22.6562V3.90625C0.804688 2.60938 1.85974 1.5625 3.16675 1.5625H23.6379C24.9449 1.5625 26 2.60938 26 3.90625V22.6562C26 23.9531 24.9449 25 23.6379 25ZM3.16675 3.125C2.72583 3.125 2.37939 3.46875 2.37939 3.90625V22.6562C2.37939 23.0938 2.72583 23.4375 3.16675 23.4375H23.6379C24.0789 23.4375 24.4253 23.0938 24.4253 22.6562V3.90625C24.4253 3.46875 24.0789 3.125 23.6379 3.125H3.16675Z"
                      fill="#939393"
                    />
                    <path
                      d="M7.89087 6.25C7.44995 6.25 7.10352 5.90625 7.10352 5.46875V0.78125C7.10352 0.34375 7.44995 0 7.89087 0C8.33179 0 8.67822 0.34375 8.67822 0.78125V5.46875C8.67822 5.90625 8.33179 6.25 7.89087 6.25ZM18.9138 6.25C18.4729 6.25 18.1265 5.90625 18.1265 5.46875V0.78125C18.1265 0.34375 18.4729 0 18.9138 0C19.3547 0 19.7012 0.34375 19.7012 0.78125V5.46875C19.7012 5.90625 19.3547 6.25 18.9138 6.25ZM25.2126 9.375H1.59204C1.15112 9.375 0.804688 9.03125 0.804688 8.59375C0.804688 8.15625 1.15112 7.8125 1.59204 7.8125H25.2126C25.6536 7.8125 26 8.15625 26 8.59375C26 9.03125 25.6536 9.375 25.2126 9.375Z"
                      fill="#939393"
                    />
                  </svg>
                }
              />
              <MemoBox label="메모 작성" value={currentResult.memo} />
            </div>
          </div>
        ))}
        <div className={styles.nextButton} onClick={handleNext}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 32 38"
            fill="none"
          >
            <path
              d="M9.82227 20.8002V5.50017C9.82227 4.78409 10.1012 4.09733 10.5976 3.59098C11.094 3.08463 11.7673 2.80017 12.4693 2.80017C13.1714 2.80017 13.8447 3.08463 14.3411 3.59098C14.8375 4.09733 15.1164 4.78409 15.1164 5.50017V19.0002M15.1164 18.1002V14.5002C15.1164 13.7841 15.3953 13.0973 15.8917 12.591C16.3881 12.0846 17.0614 11.8002 17.7634 11.8002C18.4655 11.8002 19.1388 12.0846 19.6352 12.591C20.1316 13.0973 20.4105 13.7841 20.4105 14.5002V19.0002M20.4105 16.3002C20.4105 15.5841 20.6894 14.8973 21.1858 14.391C21.6822 13.8846 22.3555 13.6002 23.0576 13.6002C23.7596 13.6002 24.4329 13.8846 24.9293 14.391C25.4257 14.8973 25.7046 15.5841 25.7046 16.3002V19.0002"
              stroke="#BABABA"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M25.7059 18.1C25.7059 17.3839 25.9848 16.6972 26.4812 16.1908C26.9776 15.6845 27.6509 15.4 28.3529 15.4C29.055 15.4 29.7283 15.6845 30.2247 16.1908C30.7211 16.6972 31 17.3839 31 18.1V26.2C31 29.0643 29.8845 31.8114 27.8988 33.8368C25.9131 35.8621 23.2199 37 20.4118 37H16.8824H17.2494C15.4959 37.0003 13.7697 36.5564 12.226 35.7081C10.6822 34.8598 9.36914 33.6338 8.40471 32.14L8.05882 31.6C7.50824 30.7384 5.57529 27.3016 2.26 21.2896C1.92197 20.6768 1.83168 19.9536 2.00832 19.2739C2.18497 18.5942 2.61461 18.0116 3.20588 17.65C3.83594 17.2655 4.57372 17.1063 5.30246 17.1976C6.03121 17.2888 6.70929 17.6254 7.22941 18.154L9.82353 20.8M4.52941 2.8L2.76471 1M2.76471 10H1M20.4118 2.8L22.1765 1M22.1765 8.2H23.9412"
              stroke="#BABABA"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className={styles.buttonSubtitle}>
            클릭해서{"\n"}다음 게시물 보기
          </p>
        </div>
      </div>
    </div>
  );
}
