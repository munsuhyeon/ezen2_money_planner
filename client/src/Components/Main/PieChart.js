import React, { useRef, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables);

const PieChart = ({
  id,
  labels,
  dataValues,
  label,
  backgroundColor,
  borderColor,
}) => {
  const chartContainerRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [chartKey, setChartKey] = useState(Date.now()); // 차트 렌더링 시점 추적

  useEffect(() => {
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setChartData({
            labels,
            datasets: [
              {
                label,
                data: dataValues,
                backgroundColor,
                borderColor,
                borderWidth: 1,
              },
            ],
          });
          // 차트가 업데이트되었음을 알리기 위해 새로운 key를 설정
          setChartKey(Date.now());
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1, // 요소의 10% 이상이 뷰포트에 보일 때 콜백 실행
    });
    const element = chartContainerRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [labels, dataValues, label, backgroundColor, borderColor]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: false,
        callbacks: {
          label: (context) => {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.raw !== undefined) {
              label += context.raw.toLocaleString();
            }
            return label;
          },
        },
      },
      datalabels: {
        color: "black", // 라벨 텍스트 색상
        font: {
          size: 16, // 라벨 폰트 크기
          weight: "bold", // 라벨 폰트 두께
        },
        formatter: (value, context) => {
          return `${context.chart.data.labels[context.dataIndex]}: ${value}%`;
        },
      },
    },
  };

  return (
    <div
      ref={chartContainerRef}
      id={id}
      style={{ height: "400px", width: "400px" }}
    >
      {chartData && (
        <Doughnut
          key={chartKey} // key를 변경하여 차트를 새로 렌더링
          data={chartData}
          options={options}
          plugins={[ChartDataLabels]} // 여기서만 ChartDataLabels 플러그인 적용
        />
      )}
    </div>
  );
};

export default PieChart;
