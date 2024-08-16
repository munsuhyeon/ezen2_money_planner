import React, { useEffect, useState} from "react";
import axios from "axios";
import { format, toZonedTime } from "date-fns-tz";
import { startOfMonth, endOfMonth } from "date-fns";

import {
  createCategoryChart,
  createTop5PayChart,
  createPaymentMethodChart,
  createLast3MonthsChart,
  // createAverageComparison,
  createEarningsExpenses,
  // createGeneralComment,
} from "../Components/chart/MonthChart.js";
import MonthDatePick from "../Components/chart/MonthDatePick.js";

import "./reset.css";
import "./MonthStatistics.css";

const MonthStatistics = () => {
  const now = new Date();
  const initialStartDate = startOfMonth(now);
  const initialEndDate = endOfMonth(now);

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [chartData, setChartData] = useState(null);
  const [userIdls, setUserIdls] = useState("");

  const [maxCategory, setMaxCategory] = useState("");
  const [maxExpense, setMaxExpense] = useState("");
  const [topDescription, setTopDescription] = useState("");
  const [topPaymentType, setTopPaymentTypeData] = useState("");
  const [topExpense, setTopExpense] = useState("");
  const [comparisonMessage, setComparisonMessage] = useState("");
  const [earningsExpenseMessage, setEarningsExpenseMessage] = useState("");

  useEffect(() => {
    const storageData = localStorage.getItem("user");
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      const userId = parsedData.userid;
      setUserIdls(userId);
      console.log("로그인한 아이디:", userId);
    }
  }, []);

  useEffect(() => {
    if (chartData) {
      createCategoryChart(chartData.categoryData);
      createTop5PayChart(chartData.descriptionData);
      createPaymentMethodChart(chartData.paymentTypeData);
      createLast3MonthsChart(chartData.threeMonthExpensesData);
      // createAverageComparison();
      createEarningsExpenses(chartData.totalIncomeAndExpenseDTOList);
      // createGeneralComment();

      if (chartData.categoryData && chartData.categoryData.length > 0) {
        const maxCategoryData = chartData.categoryData.reduce((prev, curr) =>
          prev.amount > curr.amount ? prev : curr
        );
        console.log("최대 지출 카테고리:", maxCategoryData);
        setMaxCategory(maxCategoryData.categoryName);
        setMaxExpense(maxCategoryData.amount);
      }

      if (chartData.descriptionData && chartData.descriptionData.length > 0) {
        const topDescriptionData = chartData.descriptionData.reduce(
          (prev, curr) => (prev.amount > curr.amount ? prev : curr)
        );
        console.log("최대 지출 소비항목:", topDescriptionData);
        setTopDescription(topDescriptionData.description);
      }

      if (chartData.paymentTypeData && chartData.paymentTypeData.length > 0) {
        const topPaymentTypeData = chartData.paymentTypeData.reduce(
          (prev, curr) => (prev.amount > curr.amount ? prev : curr)
        );
        console.log("최대 지출 결제수단:", topPaymentTypeData);
        setTopPaymentTypeData(topPaymentTypeData.paymentType);
        setTopExpense(topPaymentTypeData.amount);
      }

      if (
        chartData.threeMonthExpensesData &&
        chartData.threeMonthExpensesData.length > 0
      ) {
        const data = chartData.threeMonthExpensesData.reduce((acc, item) => {
          acc[item.monthPeriod] = item.amount;
          return acc;
        }, {});

        const lastMonthExpense = data.LastMonth || 0;
        const currentMonthExpense = data.CurrentMonth || 0;

        const formatNumberWithComma = (number) => {
          return number.toLocaleString();
        };

        let message = "";
        if (currentMonthExpense > lastMonthExpense) {
          message = `이번달은 지난달보다 <span>${formatNumberWithComma(
            currentMonthExpense - lastMonthExpense
          )}원</span> 더 지출하셨어요...`;
        } else if (currentMonthExpense < lastMonthExpense) {
          message = `이번달은 지난달보다 <span>${formatNumberWithComma(
            lastMonthExpense - currentMonthExpense
          )}원</span> 절약하셨어요!`;
        } else {
          message = `이번달과 지난달의 지출이 같습니다.`;
        }
        setComparisonMessage(message);
      }

      // if (chartData.totalIncomeAndExpenseDTOList) {
      //   const incomeData = chartData.totalIncomeAndExpenseDTOList.find(
      //     (item) => item.incomeType === "income"
      //   );
      //   const expenseData = chartData.totalIncomeAndExpenseDTOList.find(
      //     (item) => item.incomeType === "expense"
      //   );

      //   const income = incomeData ? incomeData.amount : 0;
      //   const expense = expenseData ? expenseData.amount : 0;

      //   const formatPercentageDifference = (value, total) => {
      //     if (total === 0) return "0.00";
      //     return ((value - total) / total * 100).toFixed(0);
      //   };

      //   let earningsExpenseMessage = "";
      //   if (income > 0) {
      //     const percentageDifference = formatPercentageDifference(expense, income);
      //     if (percentageDifference > 0) {
      //       earningsExpenseMessage = `수입보다 <span class="highlight">${percentageDifference}%</span> 많이 소비하셨어요...`;
      //     } else if (percentageDifference < 0) {
      //       earningsExpenseMessage = `수입보다 <span class="highlight">${Math.abs(percentageDifference)}%</span> 적게 소비하셨어요!`;
      //     } else {
      //       earningsExpenseMessage = `수입과 지출이 동일합니다.`;
      //     }
      //   } else {
      //     earningsExpenseMessage = `수입이 없습니다.`;
      //   }
      //   setEarningsExpenseMessage(earningsExpenseMessage);
      // }

      if (chartData.totalIncomeAndExpenseDTOList) {
        const incomeData = chartData.totalIncomeAndExpenseDTOList.find(
          (item) => item.incomeType === "income"
        );
        const expenseData = chartData.totalIncomeAndExpenseDTOList.find(
          (item) => item.incomeType === "expense"
        );

        const income = incomeData ? incomeData.amount : 0;
        const expense = expenseData ? expenseData.amount : 0;

        const formatNumberWithComma = (number) => {
          return number.toLocaleString();
        };

        let earningsExpenseMessage = "";
        if (income > 0) {
          if (expense > income) {
            earningsExpenseMessage = `수입보다 <span class="highlight">${formatNumberWithComma(
              expense - income
            )}원</span> 많이 소비하셨어요...`;
          } else if (expense < income) {
            earningsExpenseMessage = `수입보다 <span class="highlight">${formatNumberWithComma(
              income - expense
            )}원</span> 적게 소비하셨어요!`;
          } else {
            earningsExpenseMessage = `수입과 지출이 동일합니다.`;
          }
        } else {
          earningsExpenseMessage = `수입이 없습니다.`;
        }
        setEarningsExpenseMessage(earningsExpenseMessage);
      }
    }
  }, [chartData]);

  useEffect(() => {
    if (userIdls) {
      fetchChartData(startDate, endDate);
    }
  }, [startDate, endDate, userIdls]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    sendDataToServer(start, end);
    setMaxCategory("");
    setMaxExpense("");
    setTopDescription("");
    setTopPaymentTypeData("");
    setTopExpense("");
    setComparisonMessage("");
    setEarningsExpenseMessage("");
  };

  const formatDateToISO = (date) => {
    const timeZone = "Asia/Seoul";
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss", { timeZone });
  };

  const fetchChartData = (startDate, endDate) => {
    const startDateISO = formatDateToISO(startDate);
    const endDateISO = formatDateToISO(endDate);

    const userId = userIdls;
    const serverurl = `${process.env.REACT_APP_backend_HOST}/monthchart?user_id=${userId}&start_date=${startDateISO}&end_date=${endDateISO}`;

    axios
      .get(serverurl)
      .then((response) => {
        console.log("데이터를 성공적으로 받았습니다:", response.data);
        setChartData(response.data);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      });
  };

  const sendDataToServer = (startDate, endDate) => {
    const userId = userIdls;
    const url = `${process.env.REACT_APP_backend_HOST}/monthchart`;

    const startDateISO = formatDateToISO(startDate);
    const endDateISO = formatDateToISO(endDate);

    const data = {
      user_id: userId,
      start_date: startDateISO,
      end_date: endDateISO,
    };

    console.log("서버로 보내는 데이터:", data);

    axios
      .post(url, data)
      .then((response) => {
        console.log("데이터를 성공적으로 보냈습니다:", response);
      })
      .catch((error) => {
        console.error("데이터를 보내는 중 오류 발생:", error);
      });
  };

  return (
    <section className="month_chart_container">
      <div className="month_content-header">
        <div className="month_date_area">
          <MonthDatePick onChangeDate={handleDateChange} />
        </div>
      </div>

      <div className="month_chart_area">
        <div className="month_chart_flex">
          <div className="category_chart_area">
            <h2 className="category_chart_title">카테고리별 지출</h2>
            <div className="category_chart_wrap">
              <canvas id="category_chart"></canvas>
            </div>
            <ul className="chart_text">
              <li className="chart_text_category">최대 지출 카테고리</li>
              <li className="chart_text_category_detail">
                {maxCategory || "데이터 없음"}
              </li>
              <li className="chart_text_exprese">
                {maxExpense
                  ? `${maxExpense.toLocaleString()}원`
                  : "데이터 없음"}
              </li>
            </ul>
          </div>
          <div className="top_5_pay_area">
            <h2 className="top_5_pay_title">주요 소비 항목</h2>
            <div className="top_5_pay_comment">
              이번달은 <span>{topDescription || "데이터 없음"}</span> 에 가장
              많이 소비하셨어요!
            </div>
            <div className="top_5_pay_wrap">
              <canvas id="top_5_pay"></canvas>
            </div>
          </div>
        </div>
        <div className="month_chart_flex">
          <div className="payment_method_area">
            <h2 className="payment_method_title">결제수단별 지출</h2>
            <div className="payment_method_wrap">
              <canvas id="payment_method"></canvas>
            </div>
            <ul className="payment_method_chart_text_wrap">
              <li className="payment_method_chart_text">최대 지출 결제수단</li>
              <li className="payment_method_chart_text_detail">
                {topPaymentType || "데이터없음"}
              </li>
              <li className="payment_method_chart_text_exprese">
                {topExpense
                  ? `${topExpense.toLocaleString()}원`
                  : "데이터 없음"}
              </li>
            </ul>
          </div>
          <div className="last_3_month_area">
            <h2 className="last_3_month_title">최근 3개월 지출</h2>
            <div
              className="last_3_month_comment"
              dangerouslySetInnerHTML={{
                __html: comparisonMessage || "데이터 없음",
              }}
            ></div>
            <div className="last_3_month_wrap">
              <canvas id="last_3_month"></canvas>
            </div>
          </div>
          {/* <div className="average_comparison_area">
            <h2 className="average_comparison_title">
              직업군 & 나이 대비 평균지출 비교
            </h2>
            <div className="average_comparison_comment">
              평균보다 <span>10%</span> 적게 소비하셨어요!
              평균보다 <span>50%</span> 많이 소비하셨어요...
            </div>
            <div className="average_comparison_wrap">
              <canvas id="average_comparison"></canvas>
            </div>
          </div> */}
          <div className="earnings_expenses_area">
            <h2 className="earnings_expenses_title">수입 지출 비교</h2>
            <div
              className="earnings_expenses_comment"
              dangerouslySetInnerHTML={{
                __html: earningsExpenseMessage || "데이터 없음",
              }}
            ></div>
            <div className="earnings_expenses_wrap">
              <canvas id="earnings_expenses"></canvas>
            </div>
          </div>
        </div>
        {/* <div className="month_chart_flex">
          <div className="earnings_expenses_area">
            <h2 className="earnings_expenses_title">수입 지출 비교</h2>
            <div className="earnings_expenses_comment">
              수입보다 <span>50%</span> 많이 소비하셨어요...
              수입보다 <span>10%</span> 적게 소비하셨어요!
            </div>
            <div className="earnings_expenses_wrap">
              <canvas id="earnings_expenses"></canvas>
            </div>
          </div>
          <div className="general_comment_area">
            <h2 className="general_comment_title">종합 평가</h2>
            <div className="general_comment_wrap">
              <canvas id="general_comment"></canvas>
            </div>
            <div className="general_comment_score">75점</div>
            <div className="general_comment_text">
              한달 가계부 보고서에서 75점을 받은 것은 재정 관리가 일반적으로 잘
              되고 있음을 나타냅니다. 지출과 수입이 균형을 이루고 있으며, 금융
              목표를 달성하기 위한 노력이 인정받았습니다. 추가로 개선할 사항이
              있을 수 있지만, 현재 상태는 긍정적이고 지속 가능한 재정 건강을
              유지하고 있다고 평가됩니다.
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default MonthStatistics;
