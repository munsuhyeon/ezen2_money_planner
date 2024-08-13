import React from "react";
import "./BudgetPage.css";

const EndSection = ({
  monthlyBudget = 0,
  month = new Date(),
  categoryBudgetAmount = 0, // 추가된 props
}) => {
  // month가 Date 객체인지 확인합니다.
  const formattedMonth =
    month instanceof Date
      ? month.toLocaleDateString("ko-KR", { year: "numeric", month: "long" })
      : "";

  return (
    <div className="end-section">
      <div className="budget4">
        <div className="section-title2">예산 분석</div>
        <div className="section-subtitle2">
          <h3>카테고리 총 금액</h3>
          <p className="sub_title1">
            <span>{categoryBudgetAmount.toLocaleString()}</span>원
          </p>
          <div className="month-budget">
            <p className="sub_title2">{formattedMonth} 금액</p>
            <p className="sub_title3">
              <span>{monthlyBudget.toLocaleString()}</span>원
            </p>
            <p className="sub-title4">
              (이번달 총 예상 금액은 :{" "}
              <span>{monthlyBudget.toLocaleString()}</span>원)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndSection;
