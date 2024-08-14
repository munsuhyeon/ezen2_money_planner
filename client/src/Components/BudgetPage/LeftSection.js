import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ChartJS 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LeftSection = ({
  userId,
  monthlyBudget,
  month,
  barChartData,
  barChartOptions,
}) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storageData = localStorage.getItem("user");
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      setUsername(parsedData.username || ""); // `username`이 없을 경우 빈 문자열 설정
    }
  }, []);
  // monthlyBudget이 undefined일 경우 기본값으로 0을 사용
  const formattedMonthlyBudget = monthlyBudget
    ? monthlyBudget.toLocaleString()
    : "0";

  return (
    <div className="left-section">
      {/* 설정한 예산 데이터 */}
      <div className="budget1">
        <div className="section-title">설정한 예산 데이터</div>
        <div className="budget-setting">
          <img
            src="/assets/logo/nocoincat.png"
            alt="프로필 이미지"
            className="profile-image-left"
          />
          <p className="profile-content-right">
            <span>{username || "사용자"}님</span>
            <br />
            {month
              ? `${month.getFullYear()}년 ${month.getMonth() + 1}월`
              : "미정"}
            의 예산은 <br />
            <span id="total-budget">{formattedMonthlyBudget}원</span> 입니다.
          </p>
        </div>
      </div>
      {/* 최근 3개월 예산 바 차트 */}
      <div className="budget2">
        <div className="section-title">최근 3개월 예산</div>
        <div style={{ height: "500px", width: "100%" }}>
          {barChartData ? (
            <Bar data={barChartData} options={barChartOptions} />
          ) : (
            <p>데이터가 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
