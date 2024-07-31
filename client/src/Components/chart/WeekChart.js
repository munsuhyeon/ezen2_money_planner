import Chart from "chart.js/auto";

export const createCategoryChart = () => {
  const ctx = document.getElementById("week_category_chart");
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["식비", "주거비", "교통비", "의료비", "여가비", "기타"],
      datasets: [
        {
          data: [25000, 25000, 10000, 15000, 15000, 10000],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)", 
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
        },
      ],
    },
    options: {
      cutout: "80%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            padding: 20,
            generateLabels: function (chart) {
              let data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map(function (label, i) {
                  let value = data.datasets[0].data[i];
                  let total = data.datasets[0].data.reduce(
                    (acc, val) => acc + val
                  );
                  let percentage = Math.round((value / total) * 100);
                  let datasetColor = data.datasets[0].backgroundColor[i];
                  let fillColor = datasetColor;
                  let valueWon = `${value.toLocaleString()}원`;
                  return {
                    text: `${label}: ${percentage}% (${valueWon})`,
                    fillStyle: fillColor,
                    hidden:
                      isNaN(data.datasets[0].data[i]) ||
                      data.datasets[0].data[i] === 0,
                    index: i,
                    strokeStyle: 'rgba(0, 0, 0, 0)'
                  };
                });
              }
              return [];
            },
          },
          onClick: null,
        },
        tooltip: {
          displayColors: false,
          zindex: 10,
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (tooltipItem) {
              let value = tooltipItem.raw;
              return tooltipItem.label + ": " + `${value.toLocaleString()}원`;
            },
          },
        },
      },
    },
  });
};

export const createWeekPayChart = () => {
  const wpctx = document.getElementById("week_pay");
  return new Chart(wpctx, {
    type: "bar",
    data: {
      labels: ["7월 1주차", "7월 2주차", "7월 3주차", "7월 4주차"],
      datasets: [
        {
          data: [300000, 700000, 800000, 300000, 500000],
          borderWidth: 0,
        },
      ],
    },
    options: {
      indexAxis: "y",
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "none",
        },
        tooltip: {
          displayColors: false,
          zindex: 10,
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (tooltipItem) {
              let value = tooltipItem.raw;
              return tooltipItem.label + ": " + `${value.toLocaleString()}원`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            callback: function (value) {
              return (value / 10000).toLocaleString() + "만원";
            },
            maxTicksLimit: 10,
          },
        },
      },
      barThickness: 25,
    },
  });
};

export const createDayPayChart = () => {
  const wpctx = document.getElementById("day_pay");
  return new Chart(wpctx, {
    type: "line",
    data: {
      labels: [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
      ],
      datasets: [
        {
          data: [150000, 50000, 20000, 200000, 70000, 90000, 60000],
          borderWidth: 2,
          pointRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "none",
        },
        tooltip: {
          displayColors: false,
          zindex: 10,
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (tooltipItem) {
              let value = tooltipItem.raw;
              return tooltipItem.label + ": " + `${value.toLocaleString()}원`;
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return (value / 10000).toLocaleString() + "만원";
            },
            maxTicksLimit: 10,
          },
        },
      },
    },
  });
};
