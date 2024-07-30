import React, { useState } from "react";
import axios from "axios";
import "./BudgetModification.css";

// call 함수 정의
const call = async (url, method, data) => {
  try {
    // axious를 사용하여 HTTP 요청을 보냄.
    const response = await axios({
      url,
      method,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    // HTTP 요청 중 오류 발생 시 오류 메시지 출력
    console.error("HTTP 요청 오류:", error);
    throw error; // 오류를 호출자에게 전달
  }
};

const BudgetModification = () => {
  // 상태 변수: 입력된 예산 값
  const [budget, setBudget] = useState(""); // 빈 문자열로 초기화

  // 입력값 변경 처리 함수 (숫자만 포함되도록 확인하고 음수를 차단)
  const handleInputChange = (e) => {
    const value = e.target.value;
    // 입력값이 비어 있거나 숫자만 포함된 경우 업데이트
    if (/^\d*$/.test(value)) {
      setBudget(value);
    }
  };

  // 숫자를 쉼표로 형식화 하는 함수
  const formatNumber = (number) => {
    if (number === "") return "";
    return new Intl.NumberFormat().format(number);
  };

  // 형식화된 숫자를 입력 필드에 다시 설정 (제출 처리 함수)
  const handleSubmit = async () => {
    try {
      // 서버에 예산 데이터 전송
      await call("http://localhost:8080/api/budget", "POST", {
        amount: parseFloat(budget.replace(/,/g, "")), // 쉼표를 제거하고 숫자 변환
        budgetDate: new Date().toISOString().split("T")[0], // 예산 날짜 추가
      });
      // 성공 메시지 처리
      alert("예산이 성공적으로 저장되었습니다!");
      setBudget(""); // 입력 필드 초기화
    } catch (error) {
      // 제출 실패 시 오류 메시지 처리
      alert("예산 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 입력값에 쉼표를 추가하는 함수
  const handleChange = (e) => {
    let value = e.target.value.replace(/,/g, ""); // 기존 쉼표 제거
    if (/^\d*$/.test(value)) {
      value = formatNumber(value); // 새 형식 적용
      setBudget(value);
    }
  };

  return (
    <section id="budget_modification">
      <div className="budget_modification_container">
        <div className="image_container">
          <img
            src="/assets/logo/pocketcat.png"
            alt="예산 고양이"
            className="cat_image"
          />
        </div>
        <div className="budget_page_title">
          <img
            src="/assets/logo/Thicklogo.png"
            alt="모으냥 로고"
            className="logo_image"
          />
        </div>
        <div className="budget_page_sub_title">
          나의 이번 달 예산을 설정해주세요
        </div>
        <div className="input_container">
          <input
            type="text"
            id="budget_input"
            value={budget}
            onChange={handleChange}
            placeholder="예 : 15,000"
          />
          <span className="budget_span">원</span>
        </div>
        <button className="confirm_button" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </section>
  );
};

export default BudgetModification;
