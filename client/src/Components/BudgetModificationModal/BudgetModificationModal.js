import React, { useState, useEffect, useRef } from "react";
import { call } from "../service/ApiService";
import "./BudgetModificationModal.css";

const BudgetModification = ({
  isOpen,
  onClose,
  onSave,
  userId,
  budgetMonth,
}) => {
  const [budget, setBudget] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current.querySelectorAll(
        "button, input, [href]"
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  const handleChange = (e) => {
    let value = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(value)) {
      value = formatNumber(value);
      setBudget(value);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!userId) {
        alert("사용자 ID를 확인할 수 없습니다. 로그인 상태를 확인해주세요.");
        return;
      }
      await call("/budget", "POST", {
        userId,
        monthlyBudget: parseFloat(budget.replace(/,/g, "")),
        budgetDate: budgetMonth.toISOString().split("T")[0],
      });
      alert("예산이 성공적으로 저장되었습니다!");
      setBudget("");
      onSave(); // 부모 컴포넌트에 상태 업데이트 요청
      onClose(); // 모달 닫기
    } catch (error) {
      alert("예산 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const formatNumber = (number) => {
    if (number === "") return "";
    return new Intl.NumberFormat().format(number);
  };

  const handleClose = (e) => {
    if (e.key === "Escape" || e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="budgetMod_overlay"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={handleClose}
      onKeyDown={handleClose}
      tabIndex="-1"
    >
      <div
        className="budgetMod_container"
        role="document"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="budgetMod_modal_close" onClick={onClose}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="budgetMod_image_container">
          <img
            src="/assets/logo/pocketcat.png"
            alt="예산 고양이"
            className="budgetMod_cat_image"
          />
        </div>
        <div className="budgetMod_page_title">
          <img
            src="/assets/logo/Thicklogo.png"
            alt="모으냥 로고"
            className="budgetMod_logo_image"
          />
        </div>
        <div className="budgetMod_page_sub_title" id="modal-description">
          <span>나의 이번 달 예산을 설정해주세요</span>
        </div>
        <div className="budgetMod_input_container">
          <input
            type="text"
            id="budget_input"
            value={budget}
            onChange={handleChange}
            placeholder="예시 : 15,000"
            aria-describedby="budget-input-description"
            className="budgetMod_budget_input"
          />
          <span className="budgetMod_budget_span">원</span>
        </div>
        <button className="budgetMod_confirm_button" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  );
};

export default BudgetModification;
