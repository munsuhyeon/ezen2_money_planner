import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BarChart from "./BarChart";
import ScrollHandler from "../../Hooks/Main/ScrollEvent";
import "./MainChart.css";
import { call } from "../../Components/service/ApiService";
import { formatMonth } from "../../Utils/Utils.js";

const MainChart2 = () => {
  const { main4Ref } = ScrollHandler();
  const [chartData, setChartData] = useState({ labels: [], dataValues: [] });
  const [topCategories, setTopCategories] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // 현재 월로 초기화

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        // 로컬스토리지에서 userId 가져오기
        const storageData = localStorage.getItem("user");
        if (!storageData) {
          console.error("No user found in localStorage");
          return;
        }

        const parsedData = JSON.parse(storageData);
        const userId = parsedData.userid;

        // userId와 날짜를 포함하여 요청 데이터 구성
        const today = formatMonth(new Date());
        const requestData = { ...today, userId };

        // API 호출
        const response = await call("/transactions/list", "POST", requestData);
        const transactions = response.data;

        // 카테고리별 지출 총액 및 개수 계산
        const categoryCounts = {};
        const categoryTotals = {};

        transactions.forEach((transaction) => {
          if (transaction.incomeType === "income") return; // 수입 제외

          const transactionDate = new Date(transaction.transactionDate);
          if (
            transactionDate.getMonth() !== selectedMonth.getMonth() ||
            transactionDate.getFullYear() !== selectedMonth.getFullYear()
          )
            return; // 선택한 월이 아닌 경우 제외

          const category = transaction.categoryName;
          if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
            categoryTotals[category] = 0;
          }
          categoryCounts[category] += 1; // 지출 횟수 증가
          categoryTotals[category] += transaction.amount; // 지출 금액 총합 증가
        });

        // 가장 자주 지출되는 상위 3개 카테고리 선택
        const sortedCategories = Object.entries(categoryCounts).sort(
          (a, b) => b[1] - a[1]
        );

        // 상위 3개의 카테고리 선택
        const topCategoryEntries = sortedCategories.slice(0, 3);
        setTopCategories(topCategoryEntries);
        setCategoryTotals(categoryTotals);

        // BarChart 데이터 설정
        setChartData({
          labels: topCategoryEntries.map(([category]) => category),
          dataValues: topCategoryEntries.map(([, count]) => count),
        });
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    };

    fetchTransactionData();
  }, [selectedMonth]);

  // 최대 지출 횟수를 가진 카테고리(들)를 찾기
  const maxCount = topCategories.length > 0 ? topCategories[0][1] : 0;
  const topCountCategories = topCategories.filter(
    ([, count]) => count === maxCount
  );

  return (
    <>
      {/* -------------------------------Section4-------------------------------- */}
      <section id="Main-4" ref={main4Ref}>
        <div className="Main4-CheckBox">
          <p>Check 2.</p>
          <p>
            최신거래 내역을 달력으로 확인해보세요!
            <br />
            날짜별로 정리된 지출을 보며 지출을 줄일 수 있습니다.
          </p>
          <Link to="/calendar">
            <button>지출달력 확인하기</button>
          </Link>
        </div>
        <div className="Main4-Graph2">
          <div className="Graph2-Info">
            <h2>월간 주요 지출내역</h2>
            {topCategories.length > 0 ? (
              <>
                {/* 지출 횟수가 가장 많은 카테고리(들) 표시 */}
                <p>
                  자주 지출이 발생하는 곳은 <br />
                  <span>
                    {topCountCategories.map(([category], index) => (
                      <span key={index}>
                        {category}
                        {index < topCountCategories.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                  입니다.
                </p>

                {/* 상위 3개의 카테고리에 대한 정보 모두 표시 */}
                {topCategories.map(([category, count], index) => (
                  <p key={index} className="Graph2-Info-Detail">
                    {category}에 {count}번 지출하였고,{" "}
                    <span>총 {categoryTotals[category].toLocaleString()}</span>
                    원을 사용하셨습니다.
                  </p>
                ))}
              </>
            ) : (
              <p>아직 지출 내역이 없습니다.</p>
            )}
          </div>
          <div className="Main4Graph2">
            <div className="Graph2-scale">
              {chartData.labels.length > 0 ? (
                <BarChart
                  id="barChart2"
                  labels={chartData.labels}
                  dataValues={chartData.dataValues}
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
                  label="지출 횟수" // 추가된 라벨
                />
              ) : (
                <div className="no-data-message">
                  아직 저장된 이번 달 지출내역이 없습니다!
                  <br />
                  이번 달 지출 내역을 적어보세요!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* -------------------------------Section4-------------------------------- */}
    </>
  );
};

export default MainChart2;
