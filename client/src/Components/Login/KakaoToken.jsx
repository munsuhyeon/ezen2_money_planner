import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const KakaoToken = () => {
    const location = useLocation();
    const code = new URLSearchParams(location.search).get('code');

    useEffect(() => {
        const getToken = async () => {
            const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY
            const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI
            const TOKEN_URL = 'https://kauth.kakao.com/oauth/token';

            const params = {
                grant_type: 'authorization_code',
                client_id: REST_API_KEY,
                redirect_uri: REDIRECT_URI,
                code,
            };

            try {
                const response = await axios.post(TOKEN_URL, null, { params });
                const { access_token } = response.data;

                // 이후에 access_token을 사용하여 사용자 정보를 가져올 수 있습니다.
                console.log('Access Token:', access_token);

                // 사용자 정보를 요청하는 코드 예시
                const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                console.log('User Info:', userInfo.data);
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        };
        console.log(code, "akakak")

        if (code) {
            getToken();
        }
    }, [code]);

    return <div>로그인 처리 중...</div>;
};

export default KakaoToken;