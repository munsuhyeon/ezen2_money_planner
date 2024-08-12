import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import "./KakaoLogin.css";

function KakaoLogin() {
  const navigate = useNavigate();


  function kakao() {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = KAKAO_AUTH_URL;
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams);
    const code = searchParams.get('code');
    console.log(code)
  
      fetch('', {
        method: 'GET',
        headers: { 'Contetn-Type': 'application/json;charset=utf-8',
           "Access-Control-Allow-Origin": "*"}
      })
 
  }, [navigate])



  return (
    <div className="social_login_button_box">
      <button className="kakao_button" onClick={kakao}>카카오톡 로그인</button>
    </div>

  )

}

export default KakaoLogin;
