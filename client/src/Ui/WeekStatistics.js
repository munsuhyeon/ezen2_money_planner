import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, toZonedTime } from 'date-fns-tz';

import {
  createCategoryChart,
  createWeekPayChart,
  createDayPayChart,
} from "../Components/chart/WeekChart.js";
import WeekDatePick from "../Components/chart/WeekDatePick.js";

import "./reset.css";
import "./WeekStatistics.css";

const WeekStatistics = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (chartData) {
      createCategoryChart(chartData.categoryData);
      createWeekPayChart(chartData.weeklyexpenseData);
      createDayPayChart(chartData.dailyExpenseData);
    }
  }, [chartData]);

  useEffect(() => {
    fetchChartData(startDate, endDate);
  }, [startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    sendDataToServer(start, end);
  };

  const formatDateToISO = (date) => {
    const timeZone = 'Asia/Seoul';
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss", { timeZone });
  };

  const fetchChartData = (startDate, endDate) => {
    const startDateISO = formatDateToISO(startDate);
    const endDateISO = formatDateToISO(endDate);

    const userId = "test123";
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
    const userId = "test123";
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
              <li className="week_chart_text_category_detail">식비</li>
              <li className="week_chart_text_exprese">352,000원</li>
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
            <div className="day_pay_detail_text">300,000원</div>
            <h3 className="day_pay_detail_title">최대 지출 요일 & 금액</h3>
            <div className="day_pay_detail_text">
              수요일 <span>/</span> 200,000원
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeekStatistics;
