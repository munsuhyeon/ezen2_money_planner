import Chart from "chart.js/auto";

let categoryChartInstance = null;
let top5PayChartInstance = null;
let paymentMethodChartInstance = null;
let last3MonthsChartInstance = null;
// let averageComparisonChartInstance = null;
let earningsExpensesChartInstance = null;
// let generalCommentChartInstance = null;

const destroyChart = (chartInstance) => {
  if (chartInstance) {
    chartInstance.destroy();
  }
};

const transformData1 = (data) => {
  const labels = data.map((item) => item.categoryName || item.label);
  const values = data.map((item) => item.amount || item.value);
  return { labels, values };
};

const transformData2 = (data) => {
  const labels = data.map((item) => item.description || item.label);
  const values = data.map((item) => item.amount || item.value);
  return { labels, values };
};

const transformData3 = (data) => {
  const labels = data.map((item) => item.paymentType || item.label);
  const values = data.map((item) => item.amount || item.value);
  return { labels, values };
};

const transformData4 = (data) => {
  const labels = data.map((item) => item.monthPeriod || item.label);
  const values = data.map((item) => item.amount || item.value);
  return { labels, values };
};

const transformData5 = (data) => {
  const labels = data.map((item) => item.incomeType || item.label);
  const values = data.map((item) => item.amount || item.value);
  return { labels, values };
};

export const createCategoryChart = (data) => {
  const ctx = document.getElementById("category_chart");
  console.log("크아아아아악:", data);
  destroyChart(categoryChartInstance);
  const { labels, values } = transformData1(data);

  categoryChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
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

export const createTop5PayChart = (data) => {
  const t5mctx = document.getElementById("top_5_pay");
  console.log("크아아아아악:", data);
  destroyChart(top5PayChartInstance);
  const { labels, values } = transformData2(data);

  top5PayChartInstance = new Chart(t5mctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
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

export const createPaymentMethodChart = (data) => {
  const pmctx = document.getElementById("payment_method");
  console.log("크아아아아악:", data);
  destroyChart(paymentMethodChartInstance);
  const { labels, values } = transformData3(data);

  paymentMethodChartInstance = new Chart(pmctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
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

export const createLast3MonthsChart = (data) => {
  const l3mctx = document.getElementById("last_3_month");
  console.log("크아아아아악:", data);
  destroyChart(last3MonthsChartInstance);
  const { labels, values } = transformData4(data);

  last3MonthsChartInstance = new Chart(l3mctx, {
    type: "bar",
    data: {
      labels: ["두달전", "한달전", "이번달"],
      datasets: [
        {
          data: values,
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

// export const createAverageComparison = (data) => {
//   const acctx = document.getElementById("average_comparison");
//   console.log("크아아아아악:" , data)
//   destroyChart(averageComparisonChartInstance);
//   const { labels, values } = transformData(data);

//   averageComparisonChartInstance = new Chart(acctx, {
//     type: "bar",
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           data: values,
//           backgroundColor: ["rgba(0, 0, 255, 0.5)", "rgba(255, 0, 0, 0.4)"],
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: "none",
//         },
//         tooltip: {
//           displayColors: false,
//           zindex: 100,
//           callbacks: {
//             title: function (tooltipItem, data) {
//               return "";
//             },
//             label: function (tooltipItem) {
//               let value = tooltipItem.raw;
//               return `${tooltipItem.label}: ${value.toLocaleString()}원`;
//             },
//           },
//         },
//       },
//       scales: {
//         y: {
//           ticks: {
//             callback: function (value) {
//               return (value / 10000).toLocaleString() + "만원";
//             },
//             maxTicksLimit: 8,
//           },
//         },
//       },
//       barThickness: 25,
//     },
//   });
// };

export const createEarningsExpenses = (data) => {
  const eectx = document.getElementById("earnings_expenses");
  console.log("크아아아아악:", data);
  destroyChart(earningsExpensesChartInstance);
  const { labels, values } = transformData5(data);

  earningsExpensesChartInstance = new Chart(eectx, {
    type: "bar",
    data: {
      labels: ["지출", "수입"],
      datasets: [
        {
          data: values,
          backgroundColor: ["rgba(255, 0, 0, 0.4)", "rgba(0, 0, 255, 0.5)"],
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

// export const createGeneralComment = (data) => {
//   const gcctx = document.getElementById("general_comment").getContext("2d");
//   console.log("크아아아아악:" , data)
//   destroyChart(generalCommentChartInstance);
//   const { labels, values } = transformData(data);

//   generalCommentChartInstance = new Chart(gcctx, {
//     type: "doughnut",
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           data: values,
//           backgroundColor: ["#4A90E2", "#E0E0E0"],
//           borderWidth: 0,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: false,
//         },
//         tooltip: {
//           enabled: false,
//         },
//       },
//       cutout: "80%",
//       rotation: -90,
//       circumference: 180,
//     },
//   });
// };
