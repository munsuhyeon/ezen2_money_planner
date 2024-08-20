import Chart from "chart.js/auto";

let categoryChartInstance = null;
let weekPayInstance = null;
let dayPayInstance = null;

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
  const labels = data.map((item) => item.weekRange || item.label);
  const values = data.map((item) => item.totalExpense || item.value);
  return { labels, values };
};

const transformData3 = (data) => {
  const labels = data.map((item) => item.dayOfWeek || item.label);
  const values = data.map((item) => item.totalAmount || item.value);
  return { labels, values };
};

export const createCategoryChart = (data) => {
  const ctx = document.getElementById("week_category_chart");
  //console.log("카테고리차트:", data);
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

export const createWeekPayChart = (data) => {
  const wpctx = document.getElementById("week_pay");
  //console.log("주간지출차트:", data);
  destroyChart(weekPayInstance);
  const { labels, values } = transformData2(data);

  weekPayInstance = new Chart(wpctx, {
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

export const createDayPayChart = (data) => {
  const wpctx = document.getElementById("day_pay");
  //console.log("요일지출차트:", data);
  destroyChart(dayPayInstance);
  const { labels, values } = transformData3(data);

  dayPayInstance = new Chart(wpctx, {
    type: "line",
    data: {
      labels: [
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
        "일요일",
      ],
      datasets: [
        {
          data: values,
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
