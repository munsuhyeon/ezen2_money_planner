import React from "react";

import { Link } from "react-router-dom";
import {useState} from "react"

import "../../assets/css/reset.css";
import "./Login.css";



function Login() {

    const [inputId, setInputId] = useState("");
    const [inputPw, setInputPw] = useState("");

    function reqLogin (){
        // call("/login", "POST", item).then((response) => setItems(response.data));
    }
    return (
        <div className="login_section">
            <div className="login_title_container">
                <div className="login_image_box">
                    <img className="login_img" src={process.env.PUBLIC_URL + `assets/login/logo.png`} alt=""/>
            
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
                            <input type="text" value={inputId} onChange={(e) => setInputId(e.target.value)} placeholder="아이디를 입력하세요"/>
                        </div>
                        <div className="input_login">
                            <p>비밀번호</p>
                            <input type="password" value={inputPw} onChange={(e) => setInputPw(e.target.value)} placeholder="비밀번호를 입력하세요"/>
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
                        <img className="social_login_img" src={process.env.PUBLIC_URL + `assets/login/Kakao_logo.png`} alt=""/>
                    </div>
                </div>

            </div>
            <div className="forgot-signup_container">
                <div className="forgot_pw_box">
                <Link to = "/forgotpw">비밀번호를 잊으셨나요?</Link>
                </div>
                <div className="signup_button_box">
                    <Link to = "/signup"> 회원가입</Link>
                    
                </div>
            </div>
        </div>
    );
}

export default Login;