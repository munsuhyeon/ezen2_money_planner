import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  createCategoryChart,
  createTop5PayChart,
  createPaymentMethodChart,
  createLast3MonthsChart,
  createAverageComparison,
  createEarningsExpenses,
  createGeneralComment,
} from "../Components/chart/MonthChart.js";
import MonthDatePick from "../Components/chart/MonthDatePick.js";

import "./reset.css";
import "./MonthStatistics.css";

const MonthStatistics = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    createCategoryChart();
    createTop5PayChart();
    createPaymentMethodChart();
    createLast3MonthsChart();
    createAverageComparison();
    createEarningsExpenses();
    createGeneralComment();
  }, []);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    sendDataToServer(start, end);
  };

  const sendDataToServer = (startDate, endDate) => {
    const userId = "test123";
    const url = "http://localhost:8080/monthchart";

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
              <li className="chart_text_category_detail">식비</li>
              <li className="chart_text_exprese">352,000원</li>
            </ul>
          </div>
          <div className="top_5_pay_area">
            <h2 className="top_5_pay_title">주요 소비 항목</h2>
            <div className="top_5_pay_comment">
              이번달은 <span>독서</span>에 가장 많이 소비하셨어요!
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
              <li className="payment_method_chart_text_detail">신용카드</li>
              <li className="payment_method_chart_text_exprese">520,000원</li>
            </ul>
          </div>
          <div className="last_3_month_area">
            <h2 className="last_3_month_title">최근 3개월 지출</h2>
            <div className="last_3_month_comment">
              {/* 지난달 보다 <span>20%</span> 많이 지출하셨어요... */}
              지난달 보다 <span>20%</span> 적게 지출하셨어요!
            </div>
            <div className="last_3_month_wrap">
              <canvas id="last_3_month"></canvas>
            </div>
          </div>
          <div className="average_comparison_area">
            <h2 className="average_comparison_title">
              직업군 & 나이 대비 평균지출 비교
            </h2>
            <div className="average_comparison_comment">
              평균보다 <span>10%</span> 적게 소비하셨어요!
              {/* 평균보다 <span>50%</span> 많이 소비하셨어요... */}
            </div>
            <div className="average_comparison_wrap">
              <canvas id="average_comparison"></canvas>
            </div>
          </div>
        </div>
        <div className="month_chart_flex">
          <div className="earnings_expenses_area">
            <h2 className="earnings_expenses_title">수입 지출 비교</h2>
            <div className="earnings_expenses_comment">
              수입보다 <span>50%</span> 많이 소비하셨어요...
              {/* 수입보다 <span>10%</span> 적게 소비하셨어요! */}
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
        </div>
      </div>
    </section>
  );
};

export default MonthStatistics;
