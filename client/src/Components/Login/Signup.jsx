import { useState } from "react";
import axios from 'axios'
import { call } from "../service/ApiService"
import "./Signup.css";


function Signup() {

    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const Server_URL = "http://localhost:8080";

    const checkId = async () => {

        try {
            const response = await fetch(`http://localhost:8080/user/exists`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                                body: JSON.stringify({ userid: id })});
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const exists = await response.json();
            console.log(exists)
            if (exists == 0) {
                alert("사용 가능한 ID 입니다.")
            }
            else {
                alert("이미 사용된 ID 입니다.")
            }

        } catch (error) {
            console.error('Error checking user existence:', error);
        }
    };


    async function reqSignUp() {
        const formData = {
            userid: id,
            password: password,
            checkPassword: checkPassword,
            username: name,
            email: email
        }
        call('/user/signup', 'POST', formData)
            .then((response) => {
                console.log(response);
            })
            .catch(error => console.error("회원가입 실패", error), alert("회원가입 실패"));
        //    const response = await axios.post(`${Server_URL}/user/signup`, {
        //         userid : id,
        //         password : password,
        //         checkPassword : checkPassword,
        //         username : name,
        //         email : email 
        //     })
    }


    return (
        <div className="signup_section">
            <h2 className="signup_title_text">회원가입</h2>
            <div className="signup_input_container">
                <div className="input_box">
                    <h4 className="input_title">ID
                        <button onClick={checkId}>중복 확인</button></h4>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID를 입력해주세요" />
                </div>
                <div className="input_box">
                    <h4 className="input_title">비밀번호</h4>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요" />
                </div>
                <div className="input_box">
                    <h4 className="input_title">비밀번호 확인</h4>
                    <input type="password" value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} placeholder="비밀번호를 동일하게 입력해주세요" />
                </div>
                <div className="input_box">
                    <h4 className="input_title">이름</h4>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요" />
                </div>
                <div className="input_box">
                    <h4 className="input_title">Email</h4>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email 을 입력해주세요" />
                </div>
            </div>

            <div className="signup_button_container">
                <div className="signup_button_box">
                    <button className="signup_button" onClick={reqSignUp}>
                        가입하기
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Signup;