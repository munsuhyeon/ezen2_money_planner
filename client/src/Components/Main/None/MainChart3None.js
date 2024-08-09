import React from "react";
import { Link } from "react-router-dom";
import ScrollHandler from "../../../Hooks/Main/ScrollEvent";
import "./MainChartNone.css";

const MainChart3 = () => {
  const { main5NoneRef } = ScrollHandler();
  return (
    <>
      {/* -------------------------------Section5-------------------------------- */}
      <section id="Main-5None" ref={main5NoneRef}>
        <div className="Main5None-Info fade-up">
          <div className="Main5None-fadeup">
            <div className="Main5None-Info-1">
              <h2>간편하고 꼼꼼하게</h2>
              <p>
                매월 정기적으로 나가는 지출 정보를 한 눈에 확인하고, 꼼꼼하게
                관리하기
              </p>
            </div>
            <div className="Main5None-flex">
              <div className="Main5None-flex1">
                <h3>달력</h3>
                <p>달력을 통한</p>
                <p>지출 / 수입 관리</p>
              </div>
              <div className="Main5None-flex2">
                <h3>통계</h3>
                <p>그래프를 통한</p>
                <p>지출확인</p>
              </div>
              <div className="Main5None-flex3">
                <h3>예산</h3>
                <p>카테고리별 꼼꼼한</p>
                <p>예산 설정</p>
              </div>
            </div>
            <div className="Main5None-Infoflex">
              <div className="main5None-Infoflex1">
                <h4>주간보고서</h4>
                <p>
                  주간 지출과 요일 지출을
                  <br />한 눈에 볼 수 있어요.
                </p>
              </div>
              <div className="main5None-Infoflex1">
                <h4>월간보고서</h4>
                <p>
                  카테고리별 지출과 주요 소비 항목을 <br />볼 수 있어요.
                </p>
              </div>
              <div className="main5None-Infoflex2">
                <h4>예산</h4>
                <p>
                  예산을 설정해 예산을 넘어갈 때마다
                  <br />
                  알림을 받을 수 있어요.
                </p>
              </div>
              <div className="main5None-Infoflex3">
                <h4>카테고리별 예산</h4>
                <p>
                  카테고리별로 예산을 설정하고
                  <br />
                  적절히 비교할 수 있어요.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="Main5None-CheckBox">
          <div className="Main5None-CheckBoxin">
            <div className="Main5None-CheckBox-img">
              <img src="/assets/logo/nocoincat.png" alt="nocoincatImg" />
            </div>
            <div className="Main5None-CheckBox-Info">
              <p>
                간편한 회원가입으로 내 <span>가계부</span>를 더욱 스마트하게!
              </p>
              <p>
                회원 가입으로 모든 기능을 무료로 이용하고, 체계적인 재정 관리를
                시작해보세요!
              </p>
              <div className="Main5-Buttton">
                <Link to="/signup">
                  <button>회원가입하기</button>
                </Link>
                <Link to="/login">
                  <button>로그인하기</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* -------------------------------Section5-------------------------------- */}
    </>
  );
};

export default MainChart3;
