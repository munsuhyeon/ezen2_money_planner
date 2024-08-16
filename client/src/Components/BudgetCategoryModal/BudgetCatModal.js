import React, { useState, useEffect } from "react";
import { call } from "../service/ApiService";
import "./BudgetCatModal.css";
import { formatMonth } from "../../Utils/Utils";

const BudgetCatModal = ({ isOpen, onClose, onSave, userId, budgetMonth }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [updateY, setUpdateY] = useState(true); // true=처음 저장 false=수정

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        console.log("budgetMonth:::    ", budgetMonth);
        const date = formatMonth(budgetMonth); // 오늘날짜를 기준으로 1일과 마지막날 가져오기
        const requests = {
          userId: userId,
          startDate: date.startDate,
          endDate: date.endDate,
        };
        console.log(date);
        try {
          const response = await call(
            `/catbudget/user/${userId}`,
            "POST",
            requests
          );
          if (response.length > 0) {
            setCategories(response || []);
            setUpdateY(false);
          } else {
            try {
              const res = await call(`/catbudget`, "GET", null);
              console.log("카테고리 종류:::  ", res);
              setCategories(res || []);
              setUpdateY(true);
            } catch (err) {
              console.error("카테고리 종류 불러오기 오류:", err);
              setError("카테고리 종류 불러오기 오류");
            }
          }
        } catch (error) {
          setError(`카테고리 데이터 불러오기 오류: ${error.message}`);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const formatAmount = (value) => {
    return value ? Number(value.replace(/,/g, "")).toLocaleString() : "";
  };

  const unformatAmount = (value) => {
    // value가 문자열일 때만 replace를 수행하도록 수정
    if (typeof value === "string") {
      return value.replace(/,/g, "");
    }
    // value가 문자열이 아닐 경우에는 빈 문자열로 처리
    return "";
  };

  const handleAmountChange = (index, event) => {
    const newCategories = [...categories];
    newCategories[index] = {
      ...newCategories[index],
      categoryBudgetAmount: event.target.value,
    };
    setCategories(newCategories);
  };

  const handleAmountBlur = (index) => {
    const newCategories = [...categories];
    newCategories[index] = {
      ...newCategories[index],
      categoryBudgetAmount: formatAmount(
        unformatAmount(newCategories[index].categoryBudgetAmount || "")
      ),
    };
    setCategories(newCategories);
  };

  const handleSubmit = async () => {
    const formattedMonth = formatDate(new Date(budgetMonth));
    const payload = categories.map((cat) => ({
      ...cat,
      categoryBudgetAmount: parseInt(
        unformatAmount(cat.categoryBudgetAmount) || "0",
        10
      ),
      userId,
      categoryBudgetMonth: formattedMonth,
    }));
    console.log("updateY:::::::", updateY);
    console.log("송신 데이터:", payload);
    try {
      if (updateY) {
        // true = 처음저장
        await call(`/catbudget/cat-budget`, "POST", payload);
      } else {
        // false = 수정
        await call(`/catbudget/cat-budget`, "PUT", payload);
      }
      onClose();
      // 새로고침 또는 다른 후처리
    } catch (error) {
      console.error("카테고리 데이터 저장 오류  :", error);
      setError(`데이터 저장 실패: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="budgetcat">
      <div className="budgetcat-content">
        <button className="budgetcat-close-modal" onClick={onClose}>
          ×
        </button>
        <h2>카테고리 설정</h2>
        {error && <p className="budgetcat-error-message">{error}</p>}
        <div className="budgetcat-category-table">
          <label>카테고리 이름</label>
          <label>예산 금액</label>
        </div>
        {categories && categories.length > 0 ? (
          categories.map((cat, index) => (
            <div key={index} className="budgetcat-category-table">
              <input
                type="text"
                value={cat.catBudgetName || ""}
                placeholder="카테고리 이름"
                className="budgetcat-category-input"
                readOnly
              />
              <input
                type="text"
                value={cat.categoryBudgetAmount || ""}
                onChange={(event) => handleAmountChange(index, event)}
                onBlur={() => handleAmountBlur(index)}
                placeholder="금액"
                className="budgetcat-amount-input"
              />
            </div>
          ))
        ) : (
          <p>카테고리 정보가 없습니다.</p>
        )}
        <div className="budgetcat-button-group">
          <button
            type="button"
            className="budgetcat-save-button"
            onClick={handleSubmit}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetCatModal;
