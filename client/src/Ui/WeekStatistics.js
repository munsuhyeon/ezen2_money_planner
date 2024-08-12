import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { format, toZonedTime } from "date-fns-tz";
import { startOfWeek, endOfWeek } from "date-fns";

import {
  createCategoryChart,
  createWeekPayChart,
  createDayPayChart,
} from "../Components/chart/WeekChart.js";
import WeekDatePick from "../Components/chart/WeekDatePick.js";
import { UserIdContext } from "../App.js";

import "./reset.css";
import "./WeekStatistics.css";

const WeekStatistics = () => {
  const now = new Date();
  const initialStartDate = startOfWeek(now, { weekStartsOn: 1 });
  const initialEndDate = endOfWeek(now, { weekStartsOn: 1 });

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [chartData, setChartData] = useState(null);

  const [maxCategory, setMaxCategory] = useState("");
  const [maxExpense, setMaxExpense] = useState("");
  const [totalWeekExpense, setTotalWeekExpense] = useState(0);
  const [maxDayExpense, setMaxDayExpense] = useState({ day: "", amount: 0 });

  const ctxUserId = useContext(UserIdContext);

  const getDayName = (dayNumber) => {
    const dayNames = [
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
      "일요일",
    ];
    return dayNames[dayNumber - 1] || "데이터 없음";
  };

  useEffect(() => {
    if (chartData) {
      createCategoryChart(chartData.categoryData || []);
      createWeekPayChart(chartData.weeklyexpenseData || []);
      createDayPayChart(chartData.dailyExpenseData || []);

      if (chartData.categoryData && chartData.categoryData.length > 0) {
        const maxCategoryData = chartData.categoryData.reduce((prev, curr) =>
          prev.amount > curr.amount ? prev : curr
        );
        console.log("최대 지출 카테고리:", maxCategoryData);
        setMaxCategory(maxCategoryData.categoryName);
        setMaxExpense(maxCategoryData.amount);
      }

      if (chartData.dailyExpenseData && chartData.dailyExpenseData.length > 0) {
        const total = chartData.dailyExpenseData.reduce(
          (sum, expense) => sum + expense.totalAmount,
          0
        );
        console.log("주간 총 지출 금액:", total);
        setTotalWeekExpense(total);

        const maxDayData = chartData.dailyExpenseData.reduce((prev, curr) =>
          prev.totalAmount > curr.totalAmount ? prev : curr
        );
        console.log("최대 지출 요일 및 금액:", maxDayData);
        setMaxDayExpense({
          day: maxDayData.dayOfWeek,
          amount: maxDayData.totalAmount,
        });
      }
    }
  }, [chartData]);

  useEffect(() => {
    if (ctxUserId) {
      fetchChartData(startDate, endDate);
    }
  }, [startDate, endDate, ctxUserId]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    sendDataToServer(start, end);
  };

  const formatDateToISO = (date) => {
    const timeZone = "Asia/Seoul";
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss", { timeZone });
  };

  const fetchChartData = (startDate, endDate) => {
    const startDateISO = formatDateToISO(startDate);
    const endDateISO = formatDateToISO(endDate);

    const userId = ctxUserId;
    const serverurl = `http://localhost:8080/weekchart?user_id=${userId}&start_date=${startDateISO}&end_date=${endDateISO}`;

    axios
      .get(serverurl)
      .then((response) => {
        console.log("데이터를 성공적으로 받았습니다:", response.data);
        setChartData(response.data);
      })
      .catch((error) => {
        console.log("데이터를 가져오는 중 오류 발생:", error);
      });
  };

  const sendDataToServer = (startDate, endDate) => {
    const userId = ctxUserId;
    const url = "http://localhost:8080/weekchart";

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
    <section className="week_chart_container">
      <div className="week_content-header">
        <div className="week_date_area">
          <WeekDatePick onChangeDate={handleDateChange} />
        </div>
      </div>
      <div className="week_chart_area">
        <div className="week_chart_flex">
          <div className="week_category_chart_area">
            <h2 className="week_category_chart_title">카테고리별 지출</h2>
            <div className="week_category_chart_wrap">
              <canvas id="week_category_chart"></canvas>
            </div>
            <ul className="week_chart_text">
              <li className="week_chart_text_category">최대 지출 카테고리</li>
              <li className="week_chart_text_category_detail">
                {maxCategory || "데이터 없음"}
              </li>
              <li className="week_chart_text_exprese">
                {maxExpense
                  ? `${maxExpense.toLocaleString()}원`
                  : "데이터 없음"}
              </li>
            </ul>
          </div>
          <div className="week_pay_area">
            <h2 className="week_pay_title">주간별 지출</h2>
            <div className="week_pay_wrap">
              <canvas id="week_pay"></canvas>
            </div>
          </div>
        </div>
        <div className="week_chart_flex">
          <div className="day_pay_area">
            <h2 className="day_pay_title">요일별 지출</h2>
            <div className="day_pay_wrap">
              <canvas id="day_pay"></canvas>
            </div>
          </div>
          <div className="day_pay_detail_area">
            <h2 className="day_pay__detail_main_title">주간 분석</h2>
            <h3 className="day_pay_detail_title">이번주 지출 금액</h3>
            <div className="day_pay_detail_text">
              {totalWeekExpense !== undefined
                ? totalWeekExpense.toLocaleString() + "원"
                : "데이터 없음"}
            </div>
            <h3 className="day_pay_detail_title">최대 지출 요일 & 금액</h3>
            <div className="day_pay_detail_text">
              {getDayName(maxDayExpense.day)} <span>/</span>{" "}
              {maxDayExpense.amount !== undefined
                ? maxDayExpense.amount.toLocaleString() + "원"
                : "데이터 없음"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeekStatistics;
