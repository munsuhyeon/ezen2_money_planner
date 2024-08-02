import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const BarChart = ({
  id,
  labels = [],
  dataValues = [],
  label = "",
  backgroundColor = [],
  borderColor = [],
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [labels, dataValues, backgroundColor, borderColor]);

  const data = {
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
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
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
    },
    barThickness: 70,
  };

  // 디버깅을 위한 로그
  console.log("BarChart Data:", { labels, dataValues });

  return <Bar ref={chartRef} id={id} data={data} options={options} />;
};

export default BarChart;
