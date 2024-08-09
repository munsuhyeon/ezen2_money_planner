import React from "react";
import ScrollHandler from "../../../Hooks/Main/ScrollEvent";
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
                그래프를 통해 <span>주간 / 월간</span>의 총 <span>지출</span>을
                확인할 수 있어요.
              </h2>

              <p>
                주간 / 요일별 지출을 확인하고,<span>주간 분석</span>을 통해
                <br />
                최대 지출 요일과 금액을 확인할 수 있어요.
              </p>

              <p>
                주간별 지출 그래프를 확인하고
                <br />
                불필요한 지출을 줄여보세요!
              </p>
            </div>
          </div>
          <div className="Main4None-Img">
            <div className="Main4None-ImgBox">
              <img src="/assets/Main/mainintro.png" alt="mainintroImg" />
            </div>
          </div>
        </div>
      </section>
      {/* -------------------------------Section4-------------------------------- */}
    </>
  );
};

export default MainChart2;
