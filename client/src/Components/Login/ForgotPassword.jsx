
import "./ForgotPassword.css";

function ForgotPassword () {

    return (        
    <div className="forgot_password_section">
    <div className="find_passord_text_box">
        <div className="find_passord_text">비밀번호 찾기</div>
    </div>
    <div className="email_input_box">
        <h4>이메일 인증</h4>
        <input type="text" className="email_text" placeholder="가입할때 사용한 이메일을 입력해주세요"/>
    </div>
    <div className="email_send_box">
        <button>
            Send Email
        </button>
    </div>
</div>
    )
}

export default ForgotPassword;