import React from "react";
import ScrollHandler from "../../Hooks/Main/ScrollEvent";
import "./MainChartNone";

const MainChart2 = () => {
  const { main4Ref } = ScrollHandler();

  return (
    <>
      {/* -------------------------------Section4-------------------------------- */}
      <section id="Main-4None" ref={main4Ref}>
        <div className="Main4-Graph2">
          <div className="Main4None-Info">
            <div className="Main4None-Infobox">
              <h2>
                그래프를 통해 주간 / 월간의
                <br />총 지출을 확인할 수 있어요.
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
            <div className="square3"></div>
          </div>
          <div className="Main4None-Img">
            <div className="Main4None-ImgBox">
              <img
                src="/assets/Maintest/monthlyexpenses.png"
                alt="monthlyexpensesImg"
              />
            </div>
            <div className="square4"></div>
          </div>
        </div>
      </section>
      {/* -------------------------------Section4-------------------------------- */}
    </>
  );
};

export default MainChart2;
