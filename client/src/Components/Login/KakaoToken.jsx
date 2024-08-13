import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const KakaoToken = () => {
    const navigate = useNavigate();

    // URL에서 'code' 파라미터 가져오기
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    useEffect(() => {
        const getToken = async () => {
            const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
            const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
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
                console.log('Access Token:', access_token);
                const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                console.log('User Info:', userInfo.data);

                // 백엔드에 사용자 정보 전송
                await axios.post('http://localhost:8080/sns/kakao',
                    {
                        username: userInfo.data.kakao_account.profile.nickname,
                        email: userInfo.data.kakao_account.email,
                        logintype: "K"
                    },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                ).catch(error => {
                    if (error.response && error.response.status === 400) {
                        // 이미 가입한 이력이 있을 경우
                        alert('이미 가입한 이력이 있습니다.');
            }})

                    console.log('User saved successfully');
                    localStorage.setItem("kakao_token", JSON.stringify(access_token));
                    localStorage.setItem("user", JSON.stringify(userInfo));
                    navigate('/main')
                } catch (error) {
                    console.error('Error fetching access token or saving user:', error);
                }
            };

            // code가 있을 경우에만 getToken 호출
            if (code) {
                getToken();
            }
        }, [code]);

    return <div>로그인 처리 중...</div>;
};

export default KakaoToken;
