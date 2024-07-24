import React, { useEffect, useRef } from "react";
import "./MainTip.css"; // CSS 파일 import

const MainTip = () => {
  const rollingListRef = useRef(null);

  useEffect(() => {
    const roller = rollingListRef.current;
    if (roller) {
      const originalList = roller.querySelector("ul");
      const clone = originalList.cloneNode(true);

      // 클론을 원본 요소의 뒤에 추가
      roller.appendChild(clone);

      // 원본과 클론의 너비를 조정
      const listWidth = originalList.scrollWidth;
      roller.style.width = `${listWidth * 2}px`; // 원본과 클론의 너비 설정

      // 애니메이션 클래스 추가
      roller.classList.add("original");
      clone.classList.add("clone");
    }
  }, []);

  return (
    <section id="Main-6">
      <div className="Main6-Title">
        <img src="/assets/logo/smartcat.png" alt="Logo" />
        <h2>자산관리 TIP</h2>
      </div>
      <div className="Main6-TipCard">
        <div className="AllTipCard">
          <div className="rolling-list" ref={rollingListRef}>
            <ul>
              <li>
                <div className="Main6-Info">
                  <h2>다양한 수입원 파악</h2>
                  <p>
                    모든 수입원을 정확하게 기록하고 분류하세요. 정기적인 급여
                    외에도 부수입, 보너스, 이자 수입 등을 포함합니다.
                  </p>
                </div>
              </li>
              <li>
                <div className="Main6-Info">
                  <h2>세금 계획</h2>
                  <p>
                    세금 공제 혜택을 최대한 활용하고, 예상되는 세금을 미리
                    계산하여 대비합니다.
                  </p>
                </div>
              </li>
              <li>
                <div className="Main6-Info">
                  <h2>카테고리별 지출 분석</h2>
                  <p>
                    식비, 교통비, 유틸리티 등 카테고리별로 지출을 분석하여
                    절약할 수 있는 부분을 찾아보세요.
                  </p>
                </div>
              </li>
              <li>
                <div className="Main6-Info">
                  <h2>작은 지출도 기록</h2>
                  <p>
                    커피 한 잔, 간식 등 작은 지출도 놓치지 말고 기록하세요. 작은
                    지출이 쌓이면 큰 금액이 됩니다.
                  </p>
                </div>
              </li>
              <li>
                <div className="Main6-Info">
                  <h2>지출 패턴 파악</h2>
                  <p>
                    월말에 지출 내역을 분석하여 불필요한 지출 패턴을 파악하고
                    줄이는 방안을 찾습니다.
                  </p>
                </div>
              </li>
              <li>
                <div className="Main6-Info">
                  <h2>필수 지출 우선 배정</h2>
                  <p>
                    고정 지출(임대료, 공과금 등)과 필수 생활비를 먼저 예산에
                    배정하고, 나머지 금액을 가변 지출로 할당하세요.
                  </p>
                </div>
              </li>
              <li>
                <div className="Main6-Info">
                  <h2>정기적인 예산 검토</h2>
                  <p>
                    매달 예산을 검토하고, 실제 지출과 비교하여 필요에 따라
                    조정합니다.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainTip;
