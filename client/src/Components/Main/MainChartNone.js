import React from "react";
import { Link } from "react-router-dom";
import ScrollHandler from "../../Hooks/Main/ScrollEvent";
import "./MainChartNone.css";

const MainChart = () => {
  const { main3Ref } = ScrollHandler();

  return (
    <>
      <section id="Main-3None" ref={main3Ref}>
        <div className="Main3None-CheckBox">
          <p>
            회원가입을 하고 지출 / 수입내역을 적어보세요!
            <br />
            자세한 통계와 달력으로 소비패턴을 분석할 수 있어요!
          </p>
          <Link to="/transactionList">
            <button>회원가입 하기</button>
          </Link>
        </div>
        <div className="Main3-Graph1 fade-in">
          <div className="Main3None-Img">
            <div className="square1"></div>
            <div className="square2"></div>
            <img src="/assets/Maintest/img.png" alt="calendarImg" />
          </div>
          <div className="Main3None-Info">
            <h2>달력을 사용해 지출 / 수입을 확인할 수 있어요.</h2>
            <p>달력에 지출과 수입내역이 각각 표기되어</p>
            <p>알아보기 쉬워요.</p>
            <p>
              한달 지출 내역을 자세히 작성해 한 번에 본다면 불필요한 지출을 줄일
              수 있어요.
            </p>
          </div>
        </div>
      </section>
      {/* -------------------------------Section3-------------------------------- */}
    </>
  );
};

export default MainChart;
