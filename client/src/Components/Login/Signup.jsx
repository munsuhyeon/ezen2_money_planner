import { useState } from "react";
import { call } from "../service/ApiService"
import "./Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {

    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [exist_id, setExist_id] = useState("");
    // const Server_URL = `${process.env.REACT_APP_backend_HOST}`;
    const navigate = useNavigate();

    const checkId = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_backend_HOST}/user/exists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ userid: id })
            });
            if (!response.ok) {
                if (response.status === 400) {
                    alert("ID를 입력해주세요");
                } else {
                    throw new Error('네트워크 불량');
                }
                return;
            }
            const exists = await response.json();
            console.log(exists);

            if (!exists) {
                alert("사용 가능한 ID 입니다.");
                setExist_id(1);
            } else {
                alert("이미 사용된 ID 입니다.");
                setExist_id(0);
            }
        } catch (error) {
            console.error('에러메세지', error);
        }
    };

    async function reqSignUp() {
        console.log(exist_id);

        const formData = {
            userid: id,
            password: password,
            checkPassword: checkPassword,
            username: name,
            email: email
        };

        if (formData.userid == null || formData.userid.trim() === '' ||
            formData.password == null || formData.password.trim() === '' ||
            formData.checkPassword == null || formData.checkPassword.trim() === '' ||
            formData.username == null || formData.username.trim() === '' ||
            formData.email == null || formData.email.trim() === '') {
            alert("모든 값을 입력해주세요");
            return;
        }

        if (formData.password !== formData.checkPassword) {
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        if (exist_id == 1) {
            try {
                const response = await fetch(`${process.env.REACT_APP_backend_HOST}/user/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData);
                    alert('회원가입 성공');
                    navigate('/login')

                } else {
                    const responseData = await response.json();
                    console.error('회원가입 실패', responseData);
                    alert(responseData.error || '회원가입 실패');
                }
            } catch (error) {
                console.error('회원가입 실패', error);
                alert('오류 발생: ' + error.message);
            }
        } else {
            alert("ID가 중복되는지 확인해주세요")
        }
    }

    return (
        <div className="signup_section">
            <div className="signup_input_container">
                <div className="signup_image_box">
                    <img className="signup_img" src={process.env.PUBLIC_URL + `assets/logo/coincat.png`} alt="" />
                </div>
                <h2 className="signup_title_text">회원가입</h2>
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