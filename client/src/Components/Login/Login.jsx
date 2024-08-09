import React from "react";

import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../assets/css/reset.css";
import "./Login.css";




function Login() {

    const [inputId, setInputId] = useState("");
    const [inputPw, setInputPw] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();


    const loginData = { userid: inputId, password: inputPw }

    async function reqLogin() {
        console.log(loginData)
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
            // 로컬 스토리지에 로그인 정보 저장
            localStorage.setItem('user', JSON.stringify(data));

            // 홈 페이지로 이동
            navigate('/');
        } catch (error) {
            console.error('로그인 오류:', error);
            setError("아이디나 비밀번호가 올바르지 않습니다."); // 에러 메시지 설정
            alert("아이디나 비밀번호가 올바르지 않습니다.");
        }
    }

    return (
        <div className="login_section">
            <div className="login_title_container">
                <div className="login_title_box">
                    {/* <h1 className="login_title_text">로그인</h1> */}
                </div>
                <div className="login_image_box">
                    <img className="login_img" src={process.env.PUBLIC_URL + `assets/logo/Thicklogo.png`} alt="" />
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
                <div className="social_login_button_box">
                    <button className="kakao_button">카카오톡 로그인</button>
                </div>

            </div>
            <div className="forgot-signup_container">
                <div className="forgot_pw_box">
                    {/* <Link to="/forgotpw">비밀번호를 잊으셨나요?</Link> */}
                </div>
                <div className="signup_button_box">
                    <Link to="/signup"> <button className="signup_button"> 회원가입</button></Link>
                </div>
            </div>
        </div>
    );
}

export default Login;