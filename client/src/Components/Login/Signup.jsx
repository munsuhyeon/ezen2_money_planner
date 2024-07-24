

import "./Signup.css";


function Signup() {

    return (
        <div className="signup_section">
            <h2 className="signup_title_text">회원가입</h2>
            <div className="signup_input_container">
                <div className="input_box">
                    <h4 className="input_title">ID</h4>
                    <input type="text" placeholder="ID를 입력해주세요"/>
                </div>
                <div className="input_box">
                    <h4 className="input_title">비밀번호</h4>
                    <input type="text" placeholder="비밀번호를 입력해주세요"/>
                </div>
                <div className="input_box">
                    <h4 className="input_title">비밀번호 확인</h4>
                    <input type="text" placeholder="비밀번호를 동일하게 입력해주세요"/>
                </div>
                <div className="input_box">
                    <h4 className="input_title">이름</h4>
                    <input type="text" placeholder="이름을 입력해주세요"/>
                </div>
            </div>

            <div className="signup_button_container">
                <div className="signup_button_box">
                    <button className="signup_button">
                        가입하기
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Signup;