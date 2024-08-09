/* 공통 API 호출 함수
사용법 : call("/todo", "POST", item).then((response) => setItems(response.data));
*/
// call.js
export const call = async (api, method, request) => {
  const baseUrl = process.env.REACT_APP_backend_HOST;
  if (!baseUrl) {
    throw new Error("REACT_APP_backend_HOST is not defined");
  }
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  // 로컬 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
 
  if (accessToken && accessToken !== null) {
    headers.append("Authorization", "Bearer " + accessToken);
  }
  
  // 요청 옵션 설정
  const url = `${baseUrl}${api}`;
  let options = {
    headers: headers, 
    method: method, 
  };
  
  
  if (request) {
    options.body = JSON.stringify(request);
  }
  //console.log(request);
    // API 호출
    try{
      const response = await fetch(url, options);
      if(response.ok){
        const result = await response.json();
        return result;
      }else if(response.status === 403){
        window.location.href = "/login";
      }else {
        throw new Error(response);
      }
    }catch(error){
      // 오류가 발생하면 콘솔에 로그 출력
      console.error("서버 통신 에러:", error);
      throw error;
    }

  }