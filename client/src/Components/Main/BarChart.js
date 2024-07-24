import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const BarChart = ({
  id,
  labels,
  dataValues,
  label,
  backgroundColor,
  borderColor,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && chartRef.current) {
          chartRef.current.update();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
    });
    const element = document.getElementById(id);

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [id]);

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
        // 레전드 표시 제거
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

  return <Bar ref={chartRef} id={id} data={data} options={options} />;
};

export default BarChart;
