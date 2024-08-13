import React, { useState, useEffect } from "react";
import { call } from "../service/ApiService";
import "./BudgetModification.css";

const BudgetModification = () => {
  const [userId, setUserId] = useState("");
  const [budget, setBudget] = useState("");
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    // localStorage에서 userId를 가져옴
    const storageData = localStorage.getItem("user");
    if (storageData) {
      try {
        const parsedData = JSON.parse(storageData);
        const storedUserId = parsedData.userid;
        setUserId(storedUserId);
      } catch (error) {
        console.error("localStorage 데이터 파싱 오류:", error);
      }
    }
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await call("/budget", "GET"); // GET 요청
      setBudgets(data);
    } catch (error) {
      console.error("예산 데이터 조회 오류:", error);
    }
  };

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
        userId, // userId 추가
        monthlyBudget: parseFloat(budget.replace(/,/g, "")),
        budgetDate: new Date().toISOString().split("T")[0],
      });
      alert("예산이 성공적으로 저장되었습니다!");
      setBudget("");
      fetchBudgets(); // 데이터 저장 후 예산 목록 다시 가져오기
    } catch (error) {
      alert("예산 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const formatNumber = (number) => {
    if (number === "") return "";
    return new Intl.NumberFormat().format(number);
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
