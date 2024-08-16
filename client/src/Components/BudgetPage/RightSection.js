import React from "react";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./BudgetPage.css";

const RightSection = ({ categories, donutData, donutOptions }) => {
  // 도넛 차트 데이터 생성
  const chartData = donutData(categories);

  // 디버깅을 위한 콘솔 로그
  console.log("Categories data:", categories); // 월별 예산 데이터

  return (
    <div className="right-section">
      <div className="budget3">
        <div className="section-title">카테고리별 예산</div>
        <div className="chart-container">
          <Doughnut
            data={chartData}
            options={donutOptions}
            plugins={[ChartDataLabels]}
          />
        </div>
        <div className="budget-table-container">
          <table className="budget-table">
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr key={index}>
                    <td>{cat.catBudgetName || "이름 없음"}</td>
                    <td>
                      {(cat.categoryBudgetAmount ?? 0).toLocaleString()}원
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">카테고리 정보가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
