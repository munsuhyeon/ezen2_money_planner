import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PieChart from "./PieChart";
import { call } from "../../Components/service/ApiService";
import { formatMonth, getDatesFromToday } from "../../Utils/Utils";
import { getMonthlyAggregatedData } from "../../Utils/MainTransactionUtils";
import { startOfMonth, endOfMonth, format } from "date-fns";
import "./MainChart.css";

// 예산 데이터 가져오기 함수
const fetchMonthlyBudget = async (userId, year, month) => {
  try {
    const response = await call(`/budget/${userId}/${year}/${month}`, "GET");
    return response || { monthlyBudget: 0, budgetId: null };
  } catch (error) {
    console.error(`월별 예산 데이터 요청 오류:`, error.message);
    return { monthlyBudget: 0, budgetId: null };
  }
};

const fetchRecentThreeMonthsData = async (userId) => {
  const now = new Date();
  const requests = [];

  for (let i = 0; i < 3; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    requests.push(fetchMonthlyBudget(userId, year, month));
  }

  const responses = await Promise.all(requests);
  return responses.map((item, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
    return {
      label: format(monthDate, "M월"), // 예: "6월", "7월"
      value: item.monthlyBudget,
    };
  });
};

const MainChart3 = () => {
  const [chartData, setChartData] = useState({ labels: [], dataValues: [] });
  const [budgetChartData, setBudgetChartData] = useState({
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

        const dates = getDatesFromToday();
        const today = formatMonth(new Date());
        const oneMonthAgo = formatMonth(dates.oneMonthAgo);
        const twoMonthsAgo = formatMonth(dates.twoMonthsAgo);

        const [response1, response2, response3, budgetData] = await Promise.all(
          [
            call("/transactions/list", "POST", { ...today, userId }),
            call("/transactions/list", "POST", { ...oneMonthAgo, userId }),
            call("/transactions/list", "POST", { ...twoMonthsAgo, userId }),
            fetchRecentThreeMonthsData(userId),
          ]
        );

        // 예산 데이터 처리
        setBudgetChartData({
          labels: budgetData.map((item) => item.label),
          dataValues: budgetData.map((item) => item.value),
        });

        // 지출 데이터 처리
        const transactions = [
          ...response1.data,
          ...response2.data,
          ...response3.data,
        ];

        const monthDates = [
          {
            start: startOfMonth(new Date()),
            end: endOfMonth(new Date()),
            label: format(startOfMonth(new Date()), "M월"), // 예: "6월"
          },
          {
            start: startOfMonth(
              new Date(new Date().setMonth(new Date().getMonth() - 1))
            ),
            end: endOfMonth(
              new Date(new Date().setMonth(new Date().getMonth() - 1))
            ),
            label: format(
              startOfMonth(
                new Date(new Date().setMonth(new Date().getMonth() - 1))
              ),
              "M월"
            ), // 예: "7월"
          },
          {
            start: startOfMonth(
              new Date(new Date().setMonth(new Date().getMonth() - 2))
            ),
            end: endOfMonth(
              new Date(new Date().setMonth(new Date().getMonth() - 2))
            ),
            label: format(
              startOfMonth(
                new Date(new Date().setMonth(new Date().getMonth() - 2))
              ),
              "M월"
            ), // 예: "8월"
          },
        ];

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

        setChartData({
          labels: Object.keys(totalSpentByMonth),
          dataValues: Object.values(totalSpentByMonth),
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchTransactionData();
  }, []);

  const hasData =
    chartData.labels.length > 0 &&
    chartData.dataValues.some((value) => value > 0);
  const hasBudgetData =
    budgetChartData.labels.length > 0 &&
    budgetChartData.dataValues.some((value) => value > 0);

  return (
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
          {hasBudgetData ? (
            <PieChart
              id="pieChart2"
              labels={budgetChartData.labels}
              dataValues={budgetChartData.dataValues}
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
          ) : (
            <div className="no-data-message3">
              저장된 예산 내역이 없어요! 예산 내역을 저장해주세요!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainChart3;
