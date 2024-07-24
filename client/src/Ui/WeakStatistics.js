import React, { useEffect } from "react";
import {
    createCategoryChart,
    createWeakPayChart,
    createDayPayChart,
  } from "../Components/chart/WeakChart.js";
import "./WeakStatistics.css";

const WeakStatistics = () => {
    useEffect(() => {
        createCategoryChart();
        createWeakPayChart();
        createDayPayChart();
    },[]);

    return (
        <section className="weak_chart_container">
            <div className="content-header">
                <h2 className="date-button">
                07월 1주차
                <img src="../images/arrow-down-2-svgrepo-com.svg" className="arrow-down"/>
                </h2>
            </div>
            <div className="flex_area">
                <div className="weak_category_chart_area">
                    <h2 className="weak_category_chart_title">카테고리별 지출</h2>
                    <div className="weak_category_chart_wrap"><canvas id="weak_category_chart"></canvas></div>
                    <ul className="weak_chart_text">
                        <li className="weak_chart_text_category">최대 지출 카테고리</li>
                        <li className="weak_chart_text_category_detail">식비</li>
                        <li className="weak_chart_text_exprese">352,000원</li>
                    </ul>
                </div>
                <div className="weak_pay_area">
                    <h2 className="weak_pay_title">주간별 지출</h2>
                    <div className="weak_pay_wrap"><canvas id="weak_pay"></canvas></div>
                </div>
                <div className="day_pay_area">
                    <h2 className="day_pay_title">요일별 지출</h2>
                    <div className="day_pay_wrap"><canvas id="day_pay"></canvas></div>
                </div>
                <div className="day_pay_detail_area">
                    <h2 className="day_pay__detail_main_title">주간 분석</h2>
                    <h3 className="day_pay_detail_title">이번주 지출 금액</h3>
                    <div className="day_pay_detail_text">300,000원</div>
                    <h3 className="day_pay_detail_title">최대 지출 요일 & 금액</h3>
                    <div className="day_pay_detail_text">수요일 <span>/</span> 200,000원</div>
                </div>
            </div>
      </section>
    );
}

export default WeakStatistics;