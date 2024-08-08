import React from "react";
import { Link } from "react-router-dom";
import "./MainChartNone.css";

const MainChart3 = () => {
  return (
    <>
      {/* -------------------------------Section5-------------------------------- */}
      <section id="Main-5None">
        <div className="Main5None-Info">
          <h2>간편하고 꼼꼼하게</h2>
          <p>
            매월 정기적으로 나가는 지출 정보를 한 눈에 확인하고, 꼼꼼하게
            관리하기
          </p>
          <div className="Main5None-flex">
            <div className="Main5None-flex1">
              <h3>달력</h3>
              <p>달력을 통한 지출 / 수입 관리</p>
            </div>
            <div className="Main5None-flex2">
              <h3>통계</h3>
              <p>그래프를 통한 지출확인</p>
            </div>
            <div className="Main5None-flex3">
              <h3>예산</h3>
              <p>카테고리별 꼼꼼한 예산 설정</p>
            </div>
          </div>
          <div className="Main5None-Infoflex">
            <div className="main5None-Infoflex1">
              <h4>주간보고서</h4>
              <h4>주간 지출과 요일 지출을 한 눈에 볼 수 있어요.</h4>
            </div>
            <div className="main5None-Infoflex1">
              <h4>월간보고서</h4>
              <h4>카테고리별 지출과 수입 / 지출을 비교해서 볼 수 있어요.</h4>
            </div>
            <div className="main5None-Infoflex1">
              <h4>예산</h4>
              <h4>예산을 설정해 예산을 넘어갈 때마다 알림을 받을 수 있어요.</h4>
            </div>
            <div className="main5None-Infoflex1">
              <h4>카테고리별 예산</h4>
              <h4>카테고리별로 예산을 설정할 수 있어요.</h4>
            </div>
          </div>
        </div>
        <div className="Main5None-CheckBox">
          <p>Check 3.</p>
          <p>월간 지출을 확인하고 카테고리별로 예산을 정해보세요!</p>
          <p>카테고리별로 예산을 측정하고 지출을 줄이기 쉬워질 거예요.</p>
          <div className="Main5-Buttton">
            <Link to="/monthly-report">
              <button>월간지출 확인하기</button>
            </Link>
            <Link to="/budgetpage">
              <button>월간예산 확인하기</button>
            </Link>
          </div>
        </div>
      </section>
      {/* -------------------------------Section5-------------------------------- */}
    </>
  );
};

export default MainChart3;
