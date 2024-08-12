import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PieChart from "./PieChart";
import { call } from "../../Components/service/ApiService";
import { formatMonth, getDatesFromToday } from "../../Utils/Utils";
import { getMonthlyAggregatedData } from "../../Utils/MainTransactionUtils";
import { startOfMonth, endOfMonth } from "date-fns"; // 날짜 함수 추가
import "./MainChart.css";

const MainChart3 = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    dataValues: [],
  });

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const storageData = localStorage.getItem("user");
        if (!storageData) {
          console.error("No user found in localStorage");
          return;
        }

        const parsedData = JSON.parse(storageData);
        const userId = parsedData.userid;

        // 함수 사용 예
        const dates = getDatesFromToday();
        console.log("오늘 날짜:", new Date());
        console.log("한 달 전 날짜:", dates.oneMonthAgo);
        console.log("두 달 전 날짜:", dates.twoMonthsAgo);

        // 이번달
        const today = formatMonth(new Date());
        // 두달전 날짜
        const twoMonthsAgo = formatMonth(dates.twoMonthsAgo);
        // 한달전 날짜 startDate:"2024-07-01", endDate:"2024-07-31"
        const oneMonthAgo = formatMonth(dates.oneMonthAgo);

        const [response1, response2, response3] = await Promise.all([
          call("/transactions/list", "POST", { ...today, userId }),
          call("/transactions/list", "POST", { ...oneMonthAgo, userId }),
          call("/transactions/list", "POST", { ...twoMonthsAgo, userId }),
        ]);

        const transactions = [
          ...response1.data,
          ...response2.data,
          ...response3.data,
        ];

        const currentDate = new Date();
        const lastMonthDate = new Date(currentDate);
        lastMonthDate.setMonth(currentDate.getMonth() - 1);
        const twoMonthsAgoDate = new Date(currentDate);
        twoMonthsAgoDate.setMonth(currentDate.getMonth() - 2);

        // 각 월의 시작과 끝을 정의
        const monthDates = [
          {
            start: startOfMonth(currentDate),
            end: endOfMonth(currentDate),
            label: "이번 달",
          },
          {
            start: startOfMonth(lastMonthDate),
            end: endOfMonth(lastMonthDate),
            label: "한 달 전",
          },
          {
            start: startOfMonth(twoMonthsAgoDate),
            end: endOfMonth(twoMonthsAgoDate),
            label: "두 달 전",
          },
        ];

        // 월별 지출 데이터 집계
        const totalSpentByMonth = {};
        monthDates.forEach(({ start, end, label }) => {
          const monthlyData = getMonthlyAggregatedData(
            transactions,
            start,
            end
          );
          const totalSpent = Object.values(monthlyData).reduce(
            (acc, amount) => acc + amount,
            0
          );
          totalSpentByMonth[label] = totalSpent;
        });

        // 차트 데이터 설정
        setChartData({
          labels: Object.keys(totalSpentByMonth),
          dataValues: Object.values(totalSpentByMonth),
        });
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    };

    fetchTransactionData();
  }, []);

  const hasData =
    chartData.labels.length > 0 &&
    chartData.dataValues.some((value) => value > 0);

  return (
    <>
      {/* -------------------------------Section5-------------------------------- */}
      <section id="Main-5">
        <div className="Main5-CheckBox">
          <p>Check 3.</p>
          <p>월간 지출을 확인하고 카테고리별로 예산을 정해보세요!</p>
          <p>카테고리별로 예산을 측정하고 지출을 줄이기 쉬워질 거예요.</p>
          <div className="Main5-Buttton">
            <Link to="/monthly-report">
              <button>월간지출 확인하기</button>
            </Link>
            <Link to="/budgetpage">
              <button>월간예산 확인하기</button>
            </Link>
          </div>
        </div>
        <div className="Main5-Graph3">
          <div className="Main5Graph3">
            <h2>월간 지출</h2>
            {hasData ? (
              <PieChart
                id="pieChart"
                labels={chartData.labels}
                dataValues={chartData.dataValues}
                label="월간 지출"
                backgroundColor={[
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                ]}
                borderColor={[
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                ]}
              />
            ) : (
              <div className="no-data-message2">
                저장된 지출 내역이 없어요! 지출 내역을 저장해주세요!
              </div>
            )}
          </div>
          <div className="Main5Graph3">
            <h2>월간 예산</h2>
            <PieChart
              id="pieChart2"
              labels={["홍보", "개발", "운영"]}
              dataValues={[25, 35, 40]}
              label="예산 분포"
              backgroundColor={[
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ]}
              borderColor={[
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ]}
            />
          </div>
        </div>
      </section>
      {/* -------------------------------Section5-------------------------------- */}
    </>
  );
};

export default MainChart3;
