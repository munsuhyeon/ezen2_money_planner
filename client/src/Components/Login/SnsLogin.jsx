import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";

const kakaoLogin = (e) => {
    e.preventDefault();
    const clientId = process.env.REACT_APP_Kakao_clientId
    const redirectUri = process.env.REACT_APP_Kakao_redirectUri
    const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`
    window.location.href = kakaoUrl;
}


const location = useLocation();
const navigate = useNavigate();
useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    axios.post(`https://kauth.kakao.com/oauth/token`, null, {
        headers: { "Content-Type": application / x - www - form - urlencoded },
        params: {
            grant_type: "authorizatio_code",
            client_id: process.env.REACT_APP_Kakao_clientId,
            redirect_uri: process.env.REACT_APP_Kakao_redirectUri,
            code: code
        },
    })
    .then((res) => {
        console.log(res)
        axios.post(`${process.env.REACT_APP_HOST}/api/getKakaoUser`, null, {
          headers:{"data" : JSON.stringify(res.data)}
        })
        .then((res) => {
            console.log(res)
          
            if (res.data.message == "no user") {
                console.log(res.data)
                alert("회원가입 정보가 없어 회원가입화면으로 넘어갑니다")
                navigate('/register', { state: { userEmail: res.data.userEmail, userType: 'K' } })
            } else if (res.data.message == "active user") {
     
                const accessToken = res.data.accessToken;
                axios.defaults.headers.common['authorization'] = `Bearer ${accessToken}`;
                localStorage.setItem("loggedIn", true); 
                localStorage.setItem("userid", res.data.userInfo.user_id);
                localStorage.setItem("username", res.data.userInfo.user_name);
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("tokenExp", res.data.tokenExp);
                navigate('/');
                window.location.reload();
            }
        })
        .catch((err) => {
            console.log("토큰전달 에러  ::   ", err)
            alert("로그인 시도 중 오류가 발생하였습니다")
            navigate('/login');
        })
})
    .catch((err) => {
        console.log(err)
        alert("로그인 시도 중 오류가 발생하였습니다")
        navigate('/login');
    })
}, [location]);