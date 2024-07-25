import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./BudgetPage.css";

// 막대 그래프 데이터
const barChartData = {
  labels: ["2024-05", "2024-06", "2024-07"], // 최근 3개월
  datasets: [
    {
      data: [100000, 150000, 200000], // 예제 데이터
      backgroundColor: [
        "rgba(255, 99, 132, 0.75)",
        "rgba(54, 162, 235, 0.75)",
        "rgba(255, 206, 86, 0.75)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// 막대 그래프 설정
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        padding: 10,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 50000,
        callback: function (value) {
          return value.toLocaleString("ko-KR") + "원";
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString()} 원`;
        },
      },
    },
  },
  barThickness: 30,
};

// 도넛 차트 데이터
const donutData = (categories) => ({
  labels: categories.map((cat) => cat.name),
  datasets: [
    {
      data: categories.map((cat) => cat.amount),
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
      ],
    },
  ],
});

// 도넛 차트 설정
const donutOptions = (totalBudget) => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20,
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      align: "center",
      labels: {
        padding: 26,
      },
    },
    tooltip: {
      enabled: false,
    },
    datalabels: {
      formatter: function (value, context) {
        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
        const percentage = ((value / total) * 100).toFixed(2);
        return `${
          context.chart.data.labels[context.dataIndex]
        }\n${percentage}%`;
      },
      color: "#000",
      font: {
        weight: "bold",
        size: 12,
      },
      anchor: "center",
      align: "center",
      offset: 0,
    },
    beforeDraw: (chart) => {
      const { ctx, chartArea } = chart;
      ctx.save();
      ctx.font = "bold 16px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      const total = chart.data.datasets[0].data.reduce(
        (acc, curr) => acc + curr,
        0
      );
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      ctx.fillText("총 예산", centerX, centerY - 10);
      ctx.font = "bold 24px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
      ctx.fillText(`${total.toLocaleString()}원`, centerX, centerY + 10);
      ctx.restore();
    },
  },
});

const BudgetPage = () => {
  const [totalBudget, setTotalBudget] = useState(300000);
  const [month, setMonth] = useState("2024-07");
  const [categories, setCategories] = useState([
    { name: "식비", amount: 50000 },
    { name: "카페 / 디저트", amount: 50000 },
    { name: "문화생활", amount: 50000 },
    { name: "교통비", amount: 50000 },
    { name: "통신비", amount: 50000 },
    { name: "기타 비용", amount: 50000 },
  ]);

  return (
    <section id="budget_page">
      <div className="container">
        <div className="content">
          <div className="left-section">
            <div className="budget1">
              <div className="section-title">설정한 예산 데이터</div>
              <div className="budget-setting">
                <img
                  src="../images/고양이 그림.png"
                  alt="프로필 이미지"
                  className="profile-image-left"
                />
                <p className="profile-content-right">
                  <span>김영산</span>님<br />
                  설정하신 예산은 <br />
                  <span id="total-budget">
                    {totalBudget.toLocaleString()}
                  </span>{" "}
                  원입니다.
                </p>
              </div>
            </div>
            <div className="budget2">
              <div className="section-title1">최근 3개월 예산 그래프</div>
              <div className="chart-container">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>
          <div className="right-section">
            <div className="budget3">
              <div className="section-title">
                카테고리별 예산
                <input
                  type="month"
                  id="monthPicker"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>
              <div className="chart-container">
                <Doughnut
                  data={donutData(categories)}
                  options={donutOptions(totalBudget)}
                  plugins={[ChartDataLabels]} // 데이터 레이블 플러그인 추가
                />
              </div>
              <div className="budget-table-container">
                <table className="budget-table">
                  <tbody>
                    {categories.map((cat, index) => (
                      <tr key={index}>
                        <td>{cat.name}</td>
                        <td>{cat.amount.toLocaleString()}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="buttons">
                <button className="edit-button">수정</button>
                <button className="confirm-button">확인</button>
              </div>
            </div>
          </div>
          <div className="end-section">
            <div className="budget4">
              {/* 전체적인 예산 분석 */}
              <div className="section-title2">예산 분석</div>
              <div className="section-subtitle2">
                {/* 카테고리 총 금액을 계산 */}
                <h3>카테고리 총 금액</h3>
                <p className="sub_title1">
                  <span>{totalBudget.toLocaleString()}</span>원
                </p>

                <div className="month-budget">
                  {/* 이번달 예산 분석 */}
                  <p className="sub_title2">{month} 금액</p>
                  <p className="sub_title3">
                    <span>{totalBudget.toLocaleString()}</span>원
                  </p>
                  <p className="sub-title4">
                    (이번달 총 예상 금액은 : 300,000원)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetPage;
