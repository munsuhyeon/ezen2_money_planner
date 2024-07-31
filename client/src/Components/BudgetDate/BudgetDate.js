import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { MdCalendarToday } from "react-icons/md";
import "./BudgetDate.css";

const CustomDatePicker = ({ selectedDate, onChange }) => {
  // 상태 변수 : 날짜 선택 팝업 열림 여부
  const [isOpen, setIsOpen] = useState(false);
  // 상태 변수 : 현재 연도
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  // 아이콘 클릭시 달력 팝업 열기/닫기
  const handleIconClick = (event) => {
    event.stopPropagation(); // 클릭 이벤트 전파 방지
    setIsOpen((prev) => !prev); // 현재 상태를 반전 시킴
  };

  // 날짜 선택 시 호출되는 함수
  const handleChange = (date) => {
    onChange(date); // 상위 컴포넌트에 날짜 변경 통지
    setCurrentYear(date.getFullYear()); // 선택된 날짜의 연도로 현재 연도 업데이트
    setIsOpen(false); // 날짜 선택 후 달력 닫기
  };

  // 연도 변경 함수 : 클릭 시 연도를 증가/감소
  const handleYearChange = (increment) => {
    setCurrentYear((prevYear) => {
      const newYear = prevYear + increment; // 현재 연도에 increment(1 또는 -1) 을 더함
      return newYear;
    });
  };

  // 날짜 형식 변환 함수
  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString("ko-KR", options).replace(" ", "년 ") + "월";
  };

  return (
    <div className="date-picker-container-budget">
      <DatePicker
        selected={selectedDate} // 선택된 날짜
        onChange={handleChange} // 날짜 변경 시 호출 될 함수
        dateFormat="yyyy년 MM월" // 날짜 형식
        showMonthYearPicker // 월과 년 선택 가능
        locale={ko} // 한국 locale 설정
        className="custom-datepicker-budget"
        onClick={() => setIsOpen(true)} // 달력 열기
        popperPlacement="bottom" // 팝업 위치 설정
        shouldCloseOnSelect={true} // 날짜 선택 시 달력 자동 닫기
        open={isOpen} // 팝업 열림 상태
        renderCustomHeader={({
          date,
          changeYear,
          decreaseMonth,
          increaseMonth,
        }) => (
          <div className="custom-header-budget">
            <button
              onClick={() => handleYearChange(-1)}
              /* 연도 감소 버튼 */
              className="year-select-btn"
            >
              {"<"}
            </button>
            {/* 연도 선택 드롭다운 */}
            <select
              value={currentYear}
              onChange={({ target: { value } }) => {
                const newYear = parseInt(value, 10); // 선택한 연도
                setCurrentYear(newYear); // 현재 연도 업데이트
                changeYear(newYear); // DatePicker에 연도 변경 통지
              }}
              className="year-select-budget"
            >
              {/* 연도 선택 드롭다운 */}
              {Array.from({ length: 10 }, (_, i) => (
                <option
                  key={i}
                  value={currentYear - 5 + i}
                  className="year-drop-down-budget"
                >
                  {currentYear - 5 + i}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleYearChange(1)}
              className="year-select-btn"
            >
              {">"}
            </button>
          </div>
        )}
      />
      <MdCalendarToday
        className="date-picker-budget-icon"
        onClick={handleIconClick} // 아이콘 클릭 시 달력을 열고 닫기
      />
    </div>
  );
};

export default CustomDatePicker;
