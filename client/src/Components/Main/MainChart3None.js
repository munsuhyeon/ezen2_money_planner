import React from "react";
import { Link } from "react-router-dom";
import "./MainChartNone.css";

const MainChart3 = () => {
  return (
    <>
      {/* -------------------------------Section5-------------------------------- */}
      <section id="Main-5None">
        <div className="Main5-Graph3">
          <div className="Main5-Img">
            <img src="/assets/Maintest/budget.png" alt="calendarImg" />
          </div>
          <div className="Main5None-Infobox">
            <h2>
              카테고리별로 예산을 지정하고
              <br />
              소비패턴을 볼 수 있어요.
            </h2>

            <p>
              주간 / 요일별 지출을 확인하고, 종합 평가를 통해 재정 관리에 대한
            </p>
            <p>조언을 받을 수 있어요.</p>
            <p>
              수입과 지출을 비교할 수 있는 그래프를 보고 불필요한 지출을
              줄여보세요!
            </p>
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
