import React from "react";
import { Link } from "react-router-dom";
import ScrollHandler from "../../Hooks/Main/ScrollEvent";
import "./MainChartNone.css";

const MainChart = () => {
  const { main3NoneRef } = ScrollHandler();

  return (
    <>
      <section id="Main-3None" ref={main3NoneRef}>
        <div className="Main3None fade-in">
          <div className="Main3None-Content">
            <div className="Main3None-Content-Container">
              <div className="Main3None-CheckBox">
                <p>모으냥</p>
                <p>
                  모으냥을 통해 <span>지출과 수입</span>을 관리해보세요. <br />
                  <span>주간 / 월간 보고서</span>를 확인해 불필요한 지출을 줄일
                  수 있어요.
                </p>
                <p>
                  달력과 자세한 통계를 통해 지출과 수입을 볼 수 있고,
                  <br /> 사용할 예산을 미리 설정할 수 있어요.
                </p>
                <Link to="/transactionList">
                  <button>회원가입 하기</button>
                </Link>
              </div>
              <div className="Main3None-ContentImg">
                <img src="/assets/logo/nopocketcat.png" alt="nopocketcatImg" />
              </div>
            </div>
          </div>
          <div className="Main3-Graph1">
            <div className="Main3None-Info">
              <h2>달력을 사용해 지출 / 수입을 확인할 수 있어요.</h2>
              <p>달력에 지출과 수입내역이 각각 표기되어 알아보기 쉬워요.</p>
            </div>
            <div className="Main3None-Img">
              <img
                src="/assets/Maintest/purple-computer.png"
                alt="calendarImg"
              />
            </div>
            <div className="Main3None-coment">
              <p>
                <span>간단한 방식</span>으로 월별 수입과 지출을
              </p>
              <p>수정하고 추가할 수 있어요.</p>
              <p></p>
            </div>
          </div>
        </div>
      </section>
      {/* -------------------------------Section3-------------------------------- */}
    </>
  );
};

export default MainChart;
