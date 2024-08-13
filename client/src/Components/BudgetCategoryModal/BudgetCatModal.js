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
            `/catbudget/user/test123`,
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
              console.error("카테고리 종류 불러오기 오류:", error);
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
    return value ? value.replace(/,/g, "") : "0";
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
    if (updateY) {
      // true = 처음저장
      await call(`/catbudget/cat-budget`, "POST", payload)
        .then((res) => {
          onClose();
          // 새로고침
        })
        .catch((error) => {
          console.error("카테고리 데이터 저장 오류  :", error);
        });
    } else {
      // false=  수정
      await call(`/catbudget/cat-budget`, "PUT", payload)
        .then((res) => {
          onClose();
          // 새로고침
        })
        .catch((error) => {
          console.error("카테고리 데이터 수정 오류  :", error);
        });
    }
    /*
    try {
      await Promise.all(
        payload.map((category) =>
          category.catBudgetSetId
            ? call(`/catbudget/${category.catBudgetSetId}`, "PUT", category)
            : call(`/catbudget/cat-budget`, "POST", category)
        )
      );
      onSave(payload); // Save payload and close
      onClose();
    } catch (error) {
      console.error("서버 응답 오류:", error);
      const errorMessage = error.message || "데이터 저장 실패";
      setError(`데이터 저장 실패: ${errorMessage}`);
    }*/
  };

  useEffect(() => {
    if (!isOpen) {
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="budget-cat-modal">
      <div className="catmodal-content">
        <button className="close-modal" onClick={onClose}>
          ×
        </button>
        <h2>카테고리 설정</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="category-table">
          <label>카테고리 이름</label>
          <label>예산 금액</label>
        </div>
        {categories && categories.length > 0 ? (
          categories.map((cat, index) => (
            <div key={index} className="category-table">
              <input
                type="text"
                value={cat.catBudgetName || ""}
                placeholder="카테고리 이름"
                className="category-input"
                readOnly
              />
              <input
                type="text"
                value={cat.categoryBudgetAmount || ""}
                onChange={(event) => handleAmountChange(index, event)}
                onBlur={() => handleAmountBlur(index)}
                placeholder="금액"
                className="amount-input"
              />
            </div>
          ))
        ) : (
          <p>카테고리 정보가 없습니다.</p>
        )}
        <div className="button-group">
          <button type="button" className="save-button" onClick={handleSubmit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetCatModal;
