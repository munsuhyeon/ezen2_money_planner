import MainChartNone from "../../Components/Main/None/MainChartNone.js";
import MainChart2None from "../../Components/Main/None/MainChart2None.js";
import MainChart3None from "../../Components/Main/None/MainChart3None.js";
import "./MainNone.css";
import Scroll from "../../Components/ScrollTop&Bottom/Scroll.js";
import ScrollHandler from "../../Hooks/Main/ScrollEvent.js";

import Footer from "../../Components/Footer/Footer.js";

const Main = () => {
  const { main2Ref } = ScrollHandler();

  return (
    <>
      <Scroll />
      {/* -- -------------------------------Section1-------------------------------- -- */}
      <section id="Main-1None">
        <div className="Main1-Info">
          <p>지출은 계획적으로!</p>
          <p>
            재정의 첫걸음, <span>모으냥</span>
          </p>
          <p>
            <span className="Main1-ka">카카오톡</span>으로 로그인하고,
            <span className="Main1-ex"> 엑셀</span>로 저장해보세요!
          </p>
        </div>
        <div className="Main_Img"></div>
      </section>
      {/* -- -------------------------------Section1-------------------------------- -- */}
      {/* -- -------------------------------Section2-------------------------------- -- */}
      <section id="Main-2None" ref={main2Ref}>
        <div className="Main-Allcard">
          <div className="Main2_card">
            <img src="/assets/Main/TransactionList.png" alt="Card 1" />
            <h5>수입/지출내역을 한 눈에 알아볼 수 있습니다.</h5>
            <p>
              수입 / 지출내역을 그래프로 정리하여 한 눈에 알아볼 수 있어 지출을
              줄일 수 있습니다.
            </p>
          </div>
          <div className="Main2_card">
            <img src="/assets/Main/calendar.png" alt="Card 2" />
            <h5>달력으로도 편하게 확인할 수 있습니다.</h5>
            <p>날짜 별로 보기 쉬워 일별 지출을 한 눈에 확인할 수 있습니다.</p>
          </div>
          <div className="Main2_card">
            <img src="/assets/Main/Mothly.png" alt="Card 3" />
            <h5>보고서를 보고 지출을 줄일 수 있습니다.</h5>
            <p>주간 / 월간 그래프를 보며 소비 패턴을 확인할 수 있습니다.</p>
          </div>
          <div className="Main2_card">
            <img src="/assets/Main/budget.png" alt="Card 4" />
            <h5>예산설정을 간편하게 할 수 있습니다.</h5>
            <p>
              예산을 설정하여 한달, 카테고리간의 지출을 줄여나갈 수 있습니다.
            </p>
          </div>
        </div>
      </section>
      {/* -- -------------------------------Section2-------------------------------- -- */}
      <MainChartNone />
      <MainChart2None />
      <MainChart3None />
      <footer className="NoneFooter">
        <div className="FooterNone-content">
          <p>
            본사 <span>인천 남동구 인주대로 593 12층</span> | 대표이사
            <span>TEAM2</span> | 사업자등록번호 <span>2024-07-15</span>
          </p>
          <p>ⓒ 2024 ㈜모으냥</p>
          <p>
            서비스 이용약관 | 개인정보 처리방침 | 제휴문의
            <span>TEAM2@모으냥.com</span>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Main;
