import Chart from "chart.js/auto";

export const createCategoryChart = () => {
  const ctx = document.getElementById("category_chart");
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["식비", "주거비", "교통비", "의료비", "여가비", "기타"],
      datasets: [
        {
          data: [352000, 250000, 10000, 150000, 15000, 100000],
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
                    borderColor: "transparent",
                    hidden:
                      isNaN(data.datasets[0].data[i]) ||
                      data.datasets[0].data[i] === 0,
                    index: i,
                    strokeStyle: "rgba(0, 0, 0, 0)",
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
          zindex: 100,
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (tooltipItem) {
              let value = tooltipItem.raw;
              return `${tooltipItem.label}: ${value.toLocaleString()}원`;
            },
          },
        },
      },
    },
  });
};

export const createTop5PayChart = () => {
  const t5mctx = document.getElementById("top_5_pay");
  return new Chart(t5mctx, {
    type: "bar",
    data: {
      labels: ["영화", "게임", "독서", "의류", "치킨"],
      datasets: [
        {
          data: [300000, 700000, 80000, 300000, 500000],
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
          zindex: 100,
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (tooltipItem) {
              let value = tooltipItem.raw;
              return `${tooltipItem.label}: ${value.toLocaleString()}원`;
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
            maxTicksLimit: 8,
          },
        },
      },
      barThickness: 25,
    },
  });
};

export const createPaymentMethodChart = () => {
  const pmctx = document.getElementById("payment_method");
  return new Chart(pmctx, {
    type: "doughnut",
    data: {
      labels: ["신용카드", "현금", "체크카드", "계좌이체"],
      datasets: [
        {
          data: [520000, 50000, 250000, 200000],
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
                    text: `${label}: ${percentage}%`,
                    fillStyle: fillColor,
                    hidden:
                      isNaN(data.datasets[0].data[i]) ||
                      data.datasets[0].data[i] === 0,
                    index: i,
                    strokeStyle: "rgba(0, 0, 0, 0)",
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
          zindex: 100,
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (tooltipItem) {
              let value = tooltipItem.raw;
              return `${tooltipItem.label}: ${value.toLocaleString()}원`;
            },
          },
        },
      },
    },
  });
};

export const createLast3MonthsChart = () => {
  const l3mctx = document.getElementById("last_3_month");
  return new Chart(l3mctx, {
    type: "bar",
    data: {
      labels: ["5월", "6월", "7월"],
      datasets: [
        {
          data: [1500000, 2000000, 1700000],
          backgroundColor: ["rgb(175, 154, 223)"],
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
          zindex: 100,
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (tooltipItem) {
              let value = tooltipItem.raw;
              return `${tooltipItem.label}: ${value.toLocaleString()}원`;
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
            maxTicksLimit: 5,
          },
        },
      },
      barThickness: 25,
    },
  });
};

export const createAverageComparison = () => {
  const acctx = document.getElementById("average_comparison");
  return new Chart(acctx, {
    type: "bar",
    data: {
      labels: ["나", "평균"],
      datasets: [
        {
          data: [800000, 1200000],
          backgroundColor: ["rgba(0, 0, 255, 0.5)", "rgba(255, 0, 0, 0.4)"],
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
          zindex: 100,
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (tooltipItem) {
              let value = tooltipItem.raw;
              return `${tooltipItem.label}: ${value.toLocaleString()}원`;
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
            maxTicksLimit: 8,
          },
        },
      },
      barThickness: 25,
    },
  });
};

export const createEarningsExpenses = () => {
  const eectx = document.getElementById("earnings_expenses");
  return new Chart(eectx, {
    type: "bar",
    data: {
      labels: ["수입", "지출"],
      datasets: [
        {
          data: [800000, 1200000],
          backgroundColor: ["rgba(0, 0, 255, 0.5)", "rgba(255, 0, 0, 0.4)"],
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
          zindex: 100,
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (tooltipItem) {
              let value = tooltipItem.raw;
              return `${tooltipItem.label}: ${value.toLocaleString()}원`;
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
            maxTicksLimit: 8,
          },
        },
      },
      barThickness: 25,
    },
  });
};

export const createGeneralComment = () => {
  const gcctx = document.getElementById("general_comment").getContext("2d");
  return new Chart(gcctx, {
    type: "doughnut",
    data: {
      labels: ["여유", "나머지"],
      datasets: [
        {
          data: [75, 25],
          backgroundColor: ["#4A90E2", "#E0E0E0"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      cutout: "80%",
      rotation: -90,
      circumference: 180,
    },
  });
};
