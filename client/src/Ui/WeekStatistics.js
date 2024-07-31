import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    createCategoryChart();
    createWeekPayChart();
    createDayPayChart();
  }, []);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    sendDataToServer(start, end);
  };

  const sendDataToServer = (startDate, endDate) => {
    const userId = "test123";
    const url = "http://localhost:8080/weekchart";

    const data = {
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    };

    console.log("Sending data:", data);

    axios
      .post(url, data)
      .then((response) => {
        console.log("Data sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
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
