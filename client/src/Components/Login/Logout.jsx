    
    
    
    // 로그아웃 함수
    function reqLogout() {
        // 로컬스토리지에서 사용자 데이터를 제거함으로 로그아웃
        localStorage.removeItem('user');
        alert("로그아웃 되었습니다.");
        
    }

export default reqLogout;