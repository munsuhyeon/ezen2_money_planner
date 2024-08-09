import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
        headers: {},
        params: {
            grant_type: "authorizatio_code",
            client_id: process.env.REACT_APP_Kakao_clientId,
            redirect_uri: process.env.REACT_APP_Kakao_redirectUri,
            code: code
        },
    })
    .then((res) => {
        console.log(res)
    })
}, [location]);