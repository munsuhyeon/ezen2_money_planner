// new Date()에서 시간:분 으로 표시하는 함수
export const formatTime = (date) => {
    const hours  = String(date.getHours()).padStart(2, '0');
    const minutes  = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};  

// 년-월-일 으로 표시하는 함수
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

// 2024-07-29T03:03:31.000+00:00 -> 07/15 (월) 18:04 
export const convertToCustomDateFormat = (isoDateString) => {
  const daysOfWeek = [
    '일', '월', '화', '수', '목', '금', '토'
  ];

  const date = new Date(isoDateString);

  // 날짜 포맷팅을 위한 옵션 설정
  const options = {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false // 24시간 형식 사용
  };

  // 날짜와 시간 포맷팅
  const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);

  // 요일을 한글로 변환
  const weekdayIndex = date.getDay();
  const weekday = daysOfWeek[weekdayIndex];

  // 날짜 문자열을 원하는 형식으로 변환
  return formattedDate.replace(/(\d{2})\/(\d{2})/, `$1/$2 (${weekday})`);
};

// 가격 세자리 콤마 변환 함수
export const formatPrice = (price) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};