import React, { useState, useEffect } from "react";
import { call } from "../service/ApiService";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import EndSection from "./EndSection";
import CustomDatePicker from "../BudgetDate/BudgetDate";
import BudgetModal from "../BudgetModal/BudgetModal";
import BudgetCatModal from "../BudgetCategoryModal/BudgetCatModal";
import "./BudgetPage.css";
import { formatMonth } from "../../Utils/Utils";

const fetchMonthlyData = async (userId, year, month) => {
  try {
    const response = await call(`/budget/${userId}/${year}/${month}`, "GET");
    if (!response) {
      console.warn(`응답 데이터가 비어있습니다: ${year}-${month}`);
      return { monthlyBudget: 0, budgetId: null };
    }
    return response;
  } catch (error) {
    console.error(`월별 데이터 요청 오류:`, error.message);
    return { monthlyBudget: 0, budgetId: null };
  }
};

const fetchRecentThreeMonthsData = async (
  userId,
  selectedMonth,
  setMonthlyBudget,
  setCategories,
  setBudgetId
) => {
  try {
    if (!userId) {
      throw new Error("User ID가 정의되지 않았습니다.");
    }

    const now = selectedMonth || new Date();
    const requests = [];

    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      requests.push(fetchMonthlyData(userId, year, month));
    }

    const responses = await Promise.all(requests);
    const data = responses.filter(Boolean);

    const categoriesData = data.map((item, index) => ({
      name: `${
        new Date(now.getFullYear(), now.getMonth() - index, 1).getMonth() + 1
      }월`,
      amount: item?.monthlyBudget || 0,
    }));

    setCategories(categoriesData);
    if (categoriesData.length > 0) {
      setMonthlyBudget(categoriesData[0].amount);
      setBudgetId(data[0]?.budgetId || null);
    } else {
      setMonthlyBudget(0);
      setBudgetId(null);
    }
  } catch (error) {
    console.error("최근 3개월 예산 데이터 불러오기 오류:", error.message);
    setCategories([]);
    setMonthlyBudget(0);
    setBudgetId(null);
  }
};

const saveCategories = async (userId, newCategories) => {
  try {
    await Promise.all(
      newCategories.map((category) => {
        const url = category.catBudgetId
          ? `/catbudget/${category.catBudgetId}`
          : `/catbudget`;
        return call(url, "PUT", { ...category, userId });
      })
    );
  } catch (error) {
    console.error("카테고리 업데이트 오류:", error);
  }
};

const BudgetPage = () => {
  const [userId, setUserId] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [month, setMonth] = useState(new Date());
  const [categories, setCategories] = useState([]);
  const [budgetId, setBudgetId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [categoryData, setCategoryData] = useState([]);

  // Fetch userId from localStorage when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("user");
    if (storedUserId) {
      try {
        const parsedData = JSON.parse(storedUserId);
        setUserId(parsedData.userid);
      } catch (error) {
        console.error("로컬스토리지에서 사용자 ID 가져오기 오류:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchRecentThreeMonthsData(
        userId,
        month,
        setMonthlyBudget,
        setCategories,
        setBudgetId
      );
      getBudget_by_category(); // 카테고리별 예산 가져오기
    }
  }, [userId, month]);

  const handleMonthChange = (date) => {
    setMonth(date);
    fetchMonthlyData(userId, date.getFullYear(), date.getMonth() + 1).then(
      (data) => {
        setMonthlyBudget(data.monthlyBudget);
        setBudgetId(data.budgetId);
      }
    );
  };

  const handleSaveCategories = async (newCategories) => {
    try {
      await saveCategories(userId, newCategories);
      setCategories(newCategories);
      // Directly update categoryData for immediate effect
      setCategoryData(newCategories);
      setIsCatModalOpen(false);
    } catch (error) {
      setError(`카테고리 저장 실패: ${error.message}`);
    }
  };

  const getBudget_by_category = () => {
    const date = formatMonth(month);
    const request = {
      userId: userId,
      startDate: date.startDate,
      endDate: date.endDate,
    };
    call(`/catbudget/user/${userId}`, "POST", request)
      .then((response) => {
        setCategoryData(response);
      })
      .catch((error) => console.error("카테고리별 예산 가져오기 실패", error));
  };

  const barChartData = {
    labels: Array.isArray(categories) ? categories.map((cat) => cat.name) : [],
    datasets: [
      {
        label: "예산 (원)",
        data: Array.isArray(categories)
          ? categories.map((cat) => cat.amount || 0)
          : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        reverse: true,
      },
      y: {
        beginAtZero: true,
        suggestedMax:
          Math.max(
            ...(Array.isArray(categories)
              ? categories.map((cat) => cat.amount || 0)
              : [0])
          ) * 1.2,
        ticks: {
          callback: function (value) {
            return value.toLocaleString() + "원";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <section id="budget_page">
      <div className="container_budget">
        <div className="budget_top">
          <CustomDatePicker selectedDate={month} onChange={handleMonthChange} />
          <div className="buttons">
            <button
              className="page-edit-button"
              onClick={() => setIsModalOpen(true)}
            >
              예산 설정
            </button>
            <button
              className="middle-button"
              onClick={() => setIsCatModalOpen(true)}
            >
              카테고리 설정
            </button>
          </div>
        </div>
        <div className="content_budget">
          <LeftSection
            userId={userId}
            month={month}
            monthlyBudget={monthlyBudget}
            barChartData={barChartData}
            barChartOptions={barChartOptions}
          />
          <RightSection
            categories={categoryData}
            donutData={() => ({
              labels: categoryData.map((cat) => cat.catBudgetName),
              datasets: [
                {
                  data: categoryData.map(
                    (cat) => cat.categoryBudgetAmount || 0
                  ),
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
            })}
            donutOptions={{
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
                  formatter: (value, context) => {
                    const total = context.dataset.data.reduce(
                      (acc, curr) => acc + curr,
                      0
                    );
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
                },
                beforeDraw: (chart) => {
                  const { ctx, chartArea } = chart;
                  ctx.save();
                  ctx.font =
                    "bold 16px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
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
                  ctx.font =
                    "bold 24px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
                  ctx.fillText(
                    `${total.toLocaleString()}원`,
                    centerX,
                    centerY + 10
                  );
                  ctx.restore();
                },
              },
            }}
          />

          <EndSection monthlyBudget={monthlyBudget} month={month} />
        </div>
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Refresh data after closing modal
          fetchRecentThreeMonthsData(
            userId,
            month,
            setMonthlyBudget,
            setCategories,
            setBudgetId
          );
        }}
        userId={userId}
        onSave={(newBudget) => {
          setMonthlyBudget(newBudget.monthlyBudget);
          setBudgetId(newBudget.budgetId);
          // Fetch recent data after saving
          fetchRecentThreeMonthsData(
            userId,
            month,
            setMonthlyBudget,
            setCategories,
            setBudgetId
          );
        }}
        initialBudget={monthlyBudget}
      />

      <BudgetCatModal
        isOpen={isCatModalOpen}
        onClose={() => {
          setIsCatModalOpen(false);
          // Refresh category data after closing modal
          getBudget_by_category();
        }}
        onSave={(newCategories) => {
          handleSaveCategories(newCategories);
        }}
        userId={userId}
        budgetMonth={month} // month를 budgetMonth로 전달
      />
    </section>
  );
};

export default BudgetPage;
