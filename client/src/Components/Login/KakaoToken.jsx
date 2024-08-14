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

            const params = {
                grant_type: 'authorization_code',
                client_id: REST_API_KEY,
                redirect_uri: REDIRECT_URI,
                code,
            };

            try {
                // 카카오에서 토큰 받기
                const response = await axios.post('https://kauth.kakao.com/oauth/token', null, { params });
                const { access_token } = response.data;
                console.log('Access Token:', access_token);
                // 카카오에서 받은 정보를 변수 userInfo 에 저장
                const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                console.log('User Info:', userInfo.data);
                // 변수 kakaoUserInfo 에 카카오에서 받은 정보중 username, userid 저장
                const kakaoUserInfo = {
                    username : userInfo.data.properties.nickname,
                    userid : userInfo.data.id
                }
                console.log('kakaoUserInfo:', kakaoUserInfo);

                // 카카오에서 받은 정보가 저장된 userInfo 에서 userid, username, email 을 
                // 백엔드에 전송하여 데이터베이스에 저장
                // logintype 는 데이터베이스에 알맞게 직접 키와 값을 설정함
                await axios.post('http://localhost:8080/sns/kakao',
                    {
                        userid : userInfo.data.id,
                        username: userInfo.data.kakao_account.profile.nickname,
                        email : userInfo.data.kakao_account.email,
                        logintype: "K"
                    },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                ).catch(error => {
                    if (error.response && error.response.status === 400) {
                        alert('이미 가입한 이력이 있습니다.');
            }})


                    console.log(kakaoUserInfo);
                    // 로컬스토리지에 토큰 값 저장
                    localStorage.setItem("kakao_token", JSON.stringify(access_token));
                    // 로컬스토리지에 카카오에서 받은 id 값과 가입자 이름 저장
                    localStorage.setItem("user", JSON.stringify(kakaoUserInfo));
                    // 로그인 후 메인페이지로 이동
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
