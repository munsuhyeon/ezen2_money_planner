import {useState} from "react";

import axios from "axios";


import "./ForgotPassword.css";

function ForgotPassword () {

    const [inputEmail, setInputEmail] = useState("");

    const Server_URL = "http://localhost:8080"

   async function sendEmail() {
        // call("/user", "get", item).then((response) => setItems(response.data));
        const responses = await axios.get(`${Server_URL}/forgotpassword`, {});
        // const inputData = await responses.data.filter((email) => it.email == id);

        // if(inputEmail == email){
        // }
        // else{
            
        // }

    }

    return (        
    <div className="forgot_password_section">
    <div className="find_passord_text_box">
        <div className="find_passord_text">비밀번호 찾기</div>
    </div>
    <div className="email_input_box">
        <h4>이메일 인증</h4>
        <input type="text" className="email_text" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="가입할때 사용한 이메일을 입력해주세요"/>
    </div>
    <div className="email_send_box">
        <button onClick={sendEmail}>
            Send Email
        </button>
    </div>
</div>
    )
}

export default ForgotPassword;