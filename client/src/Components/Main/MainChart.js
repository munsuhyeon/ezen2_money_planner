import React from "react";
import { Link } from "react-router-dom";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import ScrollHandler from "../../Hooks/Main/ScrollEvent";
import "./MainChart.css";

const MainChart = () => {
  const { main3Ref, main4Ref } = ScrollHandler();

  return (
    <>
      {/* -------------------------------Section3-------------------------------- */}
      <section id="Main-3" ref={main3Ref}>
        <div className="Main3-CheckBox">
          <p>Check 1.</p>
          <p>
            지출 내역을 조금 더 자세하게 확인해보세요!
            <br />
            지출내역에서 더 자세한 통계를 확인할 수 있습니다.
          </p>
          <Link to="/transcationList">
            <button>지출내역 확인하기</button>
          </Link>
        </div>
        <div className="Main3-Graph1 fade-in">
          <div className="Main3Graph1">
            <div className="Graph1-scale">
              <BarChart
                id="barChart1"
                labels={["카페", "식비", "생활비"]}
                dataValues={[5, 15, 80]}
                backgroundColor={[
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                ]}
                borderColor={[
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                ]}
              />
            </div>
          </div>
          <div className="Graph1-Info">
            <h2>최신 거래내역</h2>
            <p>
              가장 최근에 지출이 많이 발생한 곳은
              <br />
              스터디 카페예요.
            </p>
            <p>
              지정하신 예산까지의 금액이 2,000원 밖에 <br />
              남지 않았어요.
            </p>
            <p>총 20,000원을 사용하셨어요.</p>
          </div>
        </div>
      </section>

      {/* -------------------------------Section3-------------------------------- */}

      {/* -------------------------------Section4-------------------------------- */}
      <section id="Main-4" ref={main4Ref}>
        <div className="Main4-CheckBox">
          <p>Check 2.</p>
          <p>
            최신거래 내역을 달력으로 확인해보세요!
            <br />
            날짜별로 정리된 지출을 보며 지출을 줄일 수 있습니다.
          </p>
          <Link to="">
            <button>지출내역 확인하기</button>
          </Link>
        </div>
        <div className="Main4-Graph2">
          <div className="Graph2-Info">
            <h2>자주 지출되는 내역</h2>
            <p>
              자주 지출이 발생하는 곳은 <br />
              카페예요.
            </p>
            <p>
              카페인을 줄이는 것도 지출을 줄이는데 큰 도움을 <br />줄 수 있어요.
            </p>
            <p>총 30,000원을 사용하셨어요 :)</p>
          </div>
          <div className="Main4Graph2">
            <div className="Graph2-scale">
              <BarChart
                id="barChart2"
                labels={["카페", "식비", "생활비"]}
                dataValues={[5, 15, 80]}
                backgroundColor={[
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                ]}
                borderColor={[
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ]}
              />
            </div>
          </div>
        </div>
      </section>
      {/* -------------------------------Section4-------------------------------- */}

      {/* -------------------------------Section5-------------------------------- */}
      <section id="Main-5">
        <div className="Main5-CheckBox">
          <p>Check 3.</p>
          <p>월간 지출을 확인하고 카테고리별로 예산을 정해보세요!</p>
          <p> 카테고리별로 예산을 측정하고 지출을 줄이기 쉬워질 거예요.</p>
          <div className="Main5-Buttton">
            <Link to="">
              <button>월간지출 확인하기</button>
            </Link>
            <Link to="">
              <button>월간예산 확인하기</button>
            </Link>
          </div>
        </div>
        <div className="Main5-Graph3">
          <div className="Main5Graph3">
            <h2>월간 지출</h2>
            <PieChart
              id="pieChart"
              labels={["홍보", "개발", "운영"]}
              dataValues={[30, 50, 20]}
              label="예산 분포"
              backgroundColor={[
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
              ]}
              borderColor={[
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ]}
            />
          </div>
          <div className="Main5Graph3">
            <h2>월간 예산</h2>
            <PieChart
              id="pieChart2"
              labels={["홍보", "개발", "운영"]}
              dataValues={[25, 35, 40]}
              label="예산 분포"
              backgroundColor={[
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ]}
              borderColor={[
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ]}
            />
          </div>
        </div>
      </section>
      {/* -------------------------------Section5-------------------------------- */}
    </>
  );
};

export default MainChart;
