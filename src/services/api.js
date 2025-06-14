import axios from 'axios';

// API_BASE_URL 정의 추가
const API_BASE_URL = 'http://localhost:3000';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 10000, // 10초 타임아웃
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터 (필요시 토큰 추가 등)
api.interceptors.request.use(
    (config) => {
        // 인증 토큰이 있다면 헤더에 추가
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
    (response) => {
        return response.data; // 응답 데이터만 반환
    },
    (error) => {
        console.error('API 요청 실패:', error.response?.data || error.message);

        // 401 에러 시 로그인 페이지로 리다이렉트 등의 처리
        if (error.response?.status === 401) {
            // 로그인 페이지로 리다이렉트 로직
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (error.response?.status === 413) {
            throw new Error('파일 크기가 너무 큽니다.');
        } else if (error.response?.status === 400) {
            throw new Error(error.response.data?.message || '잘못된 요청입니다.');
        } else if (error.response?.status === 500) {
            throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }

        return Promise.reject(error);
    }
);

export const uploadImage = async (imageFile) => {
    try {
        console.log('uploadImage 함수 시작:', {
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type
        });

        // FormData 생성 및 이미지 파일 추가
        const formData = new FormData();
        formData.append('image', imageFile);

        console.log('FormData 생성 완료, 서버로 전송 시작...');

        // 올바른 엔드포인트로 API 요청 (백엔드와 일치)
        const response = await axios.post(`${API_BASE_URL}/post/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            // 업로드 진행률 모니터링 (선택사항)
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`업로드 진행률: ${percentCompleted}%`);
            },
        });

        console.log('이미지 업로드 응답 상태:', response.status);
        console.log('이미지 업로드 응답 데이터:', response.data);

        // 응답 데이터 검증
        if (!response.data) {
            throw new Error('서버로부터 응답 데이터를 받지 못했습니다.');
        }

        return response.data;

    } catch (error) {
        console.error('uploadImage 함수 오류:', error);

        if (error.response) {
            console.error('서버 응답 오류:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        } else if (error.request) {
            console.error('네트워크 요청 오류:', error.request);
        }

        throw error;
    }
};

// 수정된 savePost 함수도 백엔드 엔드포인트와 일치시키기
export const savePost = async (postData) => {
    try {
        console.log('savePost 함수 시작:', postData);

        // 백엔드 컨트롤러의 엔드포인트와 일치
        const response = await axios.post(`${API_BASE_URL}/post`, postData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('게시물 저장 응답 상태:', response.status);
        console.log('게시물 저장 응답 데이터:', response.data);

        return response.data;

    } catch (error) {
        console.error('savePost 함수 오류:', error);

        if (error.response) {
            console.error('서버 응답 오류:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        }

        throw error;
    }
};
// 전체 게시물 조회
export const getAllPosts = async () => {
    try {
        const response = await api.get('/post');
        return response;
    } catch (error) {
        console.error('게시물 조회 실패:', error);
        throw error;
    }
};

// 특정 게시물 조회
export const getPostById = async (postId) => {
    try {
        const response = await api.get(`/post/${postId}`);
        return response;
    } catch (error) {
        console.error('게시물 조회 실패:', error);
        throw error;
    }
};

// 태그별 게시물 조회
export const getPostsByTag = async (tags) => {
    try {
        const tagParam = Array.isArray(tags) ? tags.join(',') : tags;
        const response = await api.get('/post/tag', {
            params: { tags: tagParam }
        });
        return response;
    } catch (error) {
        console.error('태그별 게시물 조회 실패:', error);
        throw error;
    }
};

// 위치별 게시물 조회
export const getPostsByLocation = async (location) => {
    try {
        const response = await api.get('/post/location', {
            params: { location }
        });
        return response;
    } catch (error) {
        console.error('위치별 게시물 조회 실패:', error);
        throw error;
    }
};

// 날짜 범위별 게시물 조회
export const getPostsByDateRange = async (startDate, endDate) => {
    try {
        const response = await api.get('/post/date-range', {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });
        return response;
    } catch (error) {
        console.error('날짜별 게시물 조회 실패:', error);
        throw error;
    }
};

// 게시물 수정 함수
export const updatePost = async (postId, postData) => {
    try {
        const response = await api.put(`/post/${postId}`, postData);
        return response;
    } catch (error) {
        console.error('게시물 수정 실패:', error);
        throw error;
    }
};

// 게시물 삭제 함수
export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/post/${postId}`);
        return response;
    } catch (error) {
        console.error('게시물 삭제 실패:', error);
        throw error;
    }
};

// 게시물 검색 함수
export const searchPosts = async (searchParams) => {
    try {
        const response = await api.get('/post/search', {
            params: searchParams
        });
        return response;
    } catch (error) {
        console.error('게시물 검색 실패:', error);
        throw error;
    }
};

// 페이지네이션을 위한 게시물 조회
export const getPostsWithPagination = async (page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
        const response = await api.get('/post/paginated', {
            params: {
                page,
                limit,
                sortBy,
                sortOrder
            }
        });
        return response;
    } catch (error) {
        console.error('페이지네이션 게시물 조회 실패:', error);
        throw error;
    }
};

// 사용자 관련 API
export const userApi = {
    // 회원가입
    register: async (userData) => {
        try {
            const response = await api.post('/user/register', userData);
            return response;
        } catch (error) {
            console.error('회원가입 실패:', error);
            throw error;
        }
    },

    // 로그인
    login: async (credentials) => {
        try {
            const response = await api.post('/user/login', credentials);
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            return response;
        } catch (error) {
            console.error('로그인 실패:', error);
            throw error;
        }
    },

    // 로그아웃
    logout: () => {
        localStorage.removeItem('token');
    },

    // 사용자 정보 조회
    getProfile: async () => {
        try {
            const response = await api.get('/user/profile');
            return response;
        } catch (error) {
            console.error('사용자 정보 조회 실패:', error);
            throw error;
        }
    },

    // 사용자 정보 수정
    updateProfile: async (userData) => {
        try {
            const response = await api.put('/user/profile', userData);
            return response;
        } catch (error) {
            console.error('사용자 정보 수정 실패:', error);
            throw error;
        }
    },

    // 비밀번호 변경
    changePassword: async (passwordData) => {
        try {
            const response = await api.put('/user/change-password', passwordData);
            return response;
        } catch (error) {
            console.error('비밀번호 변경 실패:', error);
            throw error;
        }
    },

    // 회원 탈퇴
    deleteAccount: async () => {
        try {
            const response = await api.delete('/user/account');
            localStorage.removeItem('token');
            return response;
        } catch (error) {
            console.error('회원 탈퇴 실패:', error);
            throw error;
        }
    }
};

// 파일 관련 API
export const fileApi = {
    // 파일 삭제
    deleteFile: async (fileUrl) => {
        try {
            const response = await api.delete('/file/delete', {
                data: { fileUrl }
            });
            return response;
        } catch (error) {
            console.error('파일 삭제 실패:', error);
            throw error;
        }
    }
};

// 장소 관련 API (Kakao Map API 기반)
export const locationApi = {
    // 장소 검색 (키워드 검색)
    searchPlaces: async (keyword) => {
        return new Promise((resolve, reject) => {
            if (!window.kakao || !window.kakao.maps) {
                reject(new Error('카카오 지도 라이브러리가 로드되지 않았습니다.'));
                return;
            }

            const ps = new window.kakao.maps.services.Places();

            ps.keywordSearch(keyword, (data, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve(data);
                } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                    resolve([]);
                } else {
                    reject(new Error('장소 검색에 실패했습니다.'));
                }
            });
        });
    },

    // 카테고리별 장소 검색
    searchPlacesByCategory: async (categoryCode, x, y, radius = 10000) => {
        return new Promise((resolve, reject) => {
            if (!window.kakao || !window.kakao.maps) {
                reject(new Error('카카오 지도 라이브러리가 로드되지 않았습니다.'));
                return;
            }

            const ps = new window.kakao.maps.services.Places();
            const location = new window.kakao.maps.LatLng(y, x);

            ps.categorySearch(categoryCode, (data, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve(data);
                } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                    resolve([]);
                } else {
                    reject(new Error('카테고리 검색에 실패했습니다.'));
                }
            }, {
                location: location,
                radius: radius
            });
        });
    },

    // 좌표로 주소 변환
    getAddressFromCoords: async (x, y) => {
        return new Promise((resolve, reject) => {
            if (!window.kakao || !window.kakao.maps) {
                reject(new Error('카카오 지도 라이브러리가 로드되지 않았습니다.'));
                return;
            }

            const geocoder = new window.kakao.maps.services.Geocoder();
            const coord = new window.kakao.maps.LatLng(y, x);

            geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve(result);
                } else {
                    reject(new Error('주소 변환에 실패했습니다.'));
                }
            });
        });
    },

    // 주소로 좌표 변환
    getCoordsFromAddress: async (address) => {
        return new Promise((resolve, reject) => {
            if (!window.kakao || !window.kakao.maps) {
                reject(new Error('카카오 지도 라이브러리가 로드되지 않았습니다.'));
                return;
            }

            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve(result);
                } else {
                    reject(new Error('좌표 변환에 실패했습니다.'));
                }
            });
        });
    }
};

export default api;