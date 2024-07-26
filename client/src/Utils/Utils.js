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