import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BarChart from "./BarChart";
import ScrollHandler from "../../Hooks/Main/ScrollEvent";
import "./MainChart.css";
import { call } from "../../Components/service/ApiService";
import { getWeeklyAggregatedData } from "../../Utils/MainTransactionUtils";
import { formatMonth } from "../../Utils/Utils.js";
const MainChart = () => {
  const { main3Ref } = ScrollHandler();
  const [chartData, setChartData] = useState({ labels: [], dataValues: [] });
  const [topCategories, setTopCategories] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date()); // 현재 날짜로 초기화

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const today = formatMonth(new Date());
        // 로컬스토리지에서 userId 가져오기
        const storageData = localStorage.getItem("user");
        if (!storageData) {
          console.error("No user found in localStorage");
          return;
        }
        const parsedData = JSON.parse(storageData);
        const userId = parsedData.userid;
        const requestData = { ...today, userId };
        /*
        {
          startDate: "2024-08-01",
          endDate: "2024-08-31"
        }
        */
        const response = await call("/transactions/list", "POST", requestData);
        const transactions = response.data;

        // 선택한 날짜를 기준으로 데이터를 필터링하고 집계
        const aggregatedData = getWeeklyAggregatedData(
          transactions,
          selectedDate
        );

        // 카테고리 총합 계산
        const categoryTotals = {};
        Object.keys(aggregatedData).forEach((week) => {
          Object.keys(aggregatedData[week]).forEach((category) => {
            if (!categoryTotals[category]) {
              categoryTotals[category] = 0;
            }
            categoryTotals[category] += aggregatedData[week][category];
          });
        });

        // 상위 3개 카테고리 선택
        const sortedCategories = Object.entries(categoryTotals).sort(
          (a, b) => b[1] - a[1]
        );

        const topCategoryEntries = sortedCategories.slice(0, 3);
        setTopCategories(topCategoryEntries);
        setCategoryTotals(categoryTotals);

        // BarChart 데이터 설정
        const labels = topCategoryEntries.map(([category]) => category);
        const dataValues = topCategoryEntries.map(([, total]) => total);
        setChartData({ labels, dataValues });
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    };

    fetchTransactionData();
  }, [selectedDate]);

  // 가장 높은 지출 총액을 가진 카테고리(들)를 찾기
  const maxAmount = topCategories.length > 0 ? topCategories[0][1] : 0;
  const topAmountCategories = topCategories.filter(
    ([, amount]) => amount === maxAmount
  );

  return (
    <>
      <section id="Main-3" ref={main3Ref}>
        <div className="Main3-CheckBox">
          <p>Check 1.</p>
          <p>
            지출 내역을 조금 더 자세하게 확인해보세요!
            <br />
            지출내역에서 더 자세한 통계를 확인할 수 있습니다.
          </p>
          <Link to="/transactionList">
            <button>지출내역 확인하기</button>
          </Link>
        </div>
        <div className="Main3-Graph1 fade-in">
          <div className="Main3Graph1">
            <div className="Graph1-scale">
              {chartData.labels.length > 0 ? (
                <BarChart
                  id="barChart1"
                  labels={chartData.labels}
                  dataValues={chartData.dataValues}
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
                <div className="no-data-message">
                  아직 저장된 지출내역이 없습니다!
                  <br /> 이번주 지출 내역을 적어보세요!
                </div>
              )}
            </div>
          </div>
          <div className="Graph1-Info">
            <h2>주간 지출 내역</h2>
            {topAmountCategories.length > 0 ? (
              <p>
                가장 최근에 지출이 많이 발생한 곳은
                <br />
                <span>
                  {topAmountCategories.map(([category], index) => (
                    <span key={index}>
                      {category}
                      {index < topAmountCategories.length - 1 && ", "}
                    </span>
                  ))}
                </span>
                입니다.
              </p>
            ) : (
              <p>아직 지출 내역이 없습니다.</p>
            )}
            {topAmountCategories.length > 0 &&
              topAmountCategories.map(([category, amount]) => (
                <p key={category} className="Graph1-Info-Detail">
                  {category}에 총 <span>{amount.toLocaleString()}</span>원을
                  사용하셨어요.
                </p>
              ))}
            {/* <p className="Graph1-Info-Detail2">
              지정하신 예산까지의 금액이 2,000원 밖에 <br />
              남지 않았어요.
            </p> */}
          </div>
        </div>
      </section>
      {/* -------------------------------Section3-------------------------------- */}
    </>
  );
};

export default MainChart;
