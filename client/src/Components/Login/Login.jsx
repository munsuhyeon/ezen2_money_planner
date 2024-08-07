import React from "react";

import { Link } from "react-router-dom";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

import "../../assets/css/reset.css";
import "./Login.css";




function Login() {

    const [inputId, setInputId] = useState("");
    const [inputPw, setInputPw] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    
    
    const loginData = { userid: inputId, password: inputPw }
    
    async function reqLogin() {

        try {
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // 로그인 성공
            const data = await response.json();
            console.log(data); // 서버에서 받은 데이터를 콘솔에 출력
            navigate('/');

            
        } catch (error) {
            console.error('로그인 오류:', error);
            setError("아이디나 비밀번호가 올바르지 않습니다."); // 에러 메시지 설정
            alert("아이디나 비밀번호가 올바르지 않습니다.");
        }
    }
    // 로그아웃 함수
    function reqLogout() {
        // 로컬스토리지에서 사용자 데이터를 제거함으로 로그아웃
        localStorage.removeItem('user');
        alert("로그아웃 되었습니다.");
        
    }

    // 페이지 로드 시, 사용자 로그인 상태 확인
    window.onload = function () {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            console.log('현재 로그인된 사용자:', user);
            // 로그인된 상태에서 처리할 작업 추가 가능
        } else {
            console.log('로그인된 사용자가 없습니다.');
        }
    }

    return (
        <div className="login_section">
            <div className="login_title_container">
                <div className="login_image_box">
                    <img className="login_img" src={process.env.PUBLIC_URL + `assets/login/logo.png`} alt="" />

                </div>
                <div className="login_title_box">
                    <h1 className="login_title_text">로그인</h1>
                </div>
            </div>
            <div className="login_detail_wrapper">
                <div className="login_form_container">
                    <form action="" className="login_form_box">
                        <div className="input_login">
                            <p>아이디</p>
                            <input
                                type="text"
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder="아이디를 입력하세요" />
                        </div>
                        <div className="input_login">
                            <p>비밀번호</p>
                            <input
                                type="password"
                                value={inputPw}
                                onChange={(e) => setInputPw(e.target.value)}
                                placeholder="비밀번호를 입력하세요" />
                        </div>
                    </form>
                </div>
                <div className="login_button_container">
                    <div className="login_button_box">
                        <button onClick={reqLogin}>
                            로그인
                        </button>
                    </div>
                </div>
            </div>
            <div className="social_login_container">
                <div className="social_login_title_box">
                    <h3 className="social_login_title">소셜 로그인</h3>
                </div>
                <div className="social_login_button_box">
                    <div className="social_login_button">
                        <img className="social_login_img" src={process.env.PUBLIC_URL + `assets/login/Kakao_logo.png`} alt="" />
                    </div>
                </div>

            </div>
            <div className="forgot-signup_container">
                <div className="forgot_pw_box">
                    <Link to="/forgotpw">비밀번호를 잊으셨나요?</Link>
                </div>
                <div className="signup_button_box">
                    <Link to="/signup"> 회원가입</Link>

                </div>
            </div>
        </div>
    );
}

export default Login;