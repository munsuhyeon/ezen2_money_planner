import React, { useState, useEffect } from "react";
import { call } from "../service/ApiService";
import "./BudgetModal.css";

const BudgetModal = ({
  isOpen,
  onClose,
  userId,
  onSave,
  initialBudget = 0,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [rawValue, setRawValue] = useState("");
  const [budget, setBudget] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const formatNumber = (num) => {
    if (num === "" || isNaN(num)) return "";
    const [integer] = Number(num).toFixed(0).split(".");
    return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원`;
  };

  const parseNumber = (str) => Number(str.replace(/[^0-9]/g, ""));

  useEffect(() => {
    if (isOpen && userId) {
      const fetchBudget = async () => {
        try {
          const data = await call(
            `/budget/${userId}/${currentYear}/${currentMonth}`,
            "GET"
          );
          if (data && typeof data.monthlyBudget === "number") {
            setBudget(data);
            const formattedValue = formatNumber(data.monthlyBudget);
            setInputValue(formattedValue);
            setRawValue(data.monthlyBudget.toString());
          } else {
            setInputValue(formatNumber(initialBudget));
            setRawValue(initialBudget.toString());
          }
        } catch (error) {
          console.error("Failed to fetch budget:", error.message);
          alert("예산 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
        }
      };

      fetchBudget();
    } else {
      setInputValue(formatNumber(initialBudget));
      setRawValue(initialBudget.toString());
    }

    return () => {
      // 모달이 닫힐 때 상태 초기화
      setInputValue("");
      setRawValue("");
      setBudget(null);
    };
  }, [isOpen, userId, initialBudget, currentYear, currentMonth]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const value = e.target.value;
    const numericValue = parseNumber(value);
    setRawValue(numericValue.toString());
    setInputValue(formatNumber(numericValue));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newRawValue = rawValue.slice(0, -1);
      setRawValue(newRawValue);
      setInputValue(formatNumber(newRawValue));
    }
  };

  const handleSave = async () => {
    const numericValue = parseNumber(inputValue);
    if (!isNaN(numericValue) && numericValue >= 0 && userId) {
      const budgetData = {
        monthlyBudget: numericValue,
        budgetDate: new Date().toISOString().split("T")[0], // 예: "2024-08-01"
      };

      try {
        let response;
        if (budget && budget.budgetId) {
          // 예산이 이미 존재하는 경우, POST 요청
          response = await call(
            `/budget/${userId}/${budget.budgetId}`,
            "POST",
            budgetData
          );
        } else {
          // 예산이 없는 경우, POST 요청으로 새 예산 생성
          response = await call(`/budget/${userId}`, "POST", budgetData);
        }

        //console.log("Response object:", response); // 디버깅용
        const savedBudget = response; // JSON으로 변환된 데이터

        if (onSave) onSave(savedBudget);
        onClose();
        //console.log("예산이 성공적으로 저장되었습니다.");
      } catch (error) {
        console.error("예산 저장에 실패했습니다:", error.message);
        alert("예산 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      console.error("User ID가 정의되지 않았거나 입력 값이 유효하지 않습니다.");
      alert("유효한 사용자 ID와 입력 값을 확인하세요.");
    }
  };

  return (
    <div className="budget-modal-overlay">
      <div className="budget-modal-content">
        <button className="budget-close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="budget-modal-header-h2">예산 설정</h2>
        <img
          src="/assets/logo/pocketcat.png"
          alt="프로필 이미지"
          className="budget-profile-image-modal"
        />
        <p className="budget-profile-content-modal">
          <span>앗!</span> 한달 사용할 예산을 다시 설정해주세요!
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="예산을 입력하세요"
        />
        <div className="budget-modal-buttons">
          <button onClick={handleSave}>저장</button>
          <button className="budget-cancel-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
