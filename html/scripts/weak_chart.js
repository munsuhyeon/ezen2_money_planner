export function createWeakPayChart() {
  const wpctx = document.getElementById("weak_pay");
  return new Chart(wpctx, {
    type: "bar",
    data: {
      labels: ["7월 1주차", "7월 2주차", "7월 3주차", "7월 4주차"],
      datasets: [
        {
          data: [30, 70, 80, 30, 50],
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
      responsive: false,
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
              return (
                tooltipItem.label + ": " + Math.round(tooltipItem.raw) + "만원"
              );
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            callback: function (value) {
              return value.toLocaleString() + "만원";
            },
            maxTicksLimit: 10,
          },
        },
      },
      barThickness: 25,
    },
  });
}

export function createDayPayChart() {
  const wpctx = document.getElementById("day_pay");
  return new Chart(wpctx, {
    type: "line",
    data: {
      labels: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
      datasets: [
        {
          data: [15, 5, 2, 20, 7, 9, 6],
          borderWidth: 2,
        },
      ],
    },
    options: {  
      responsive: false,
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
              return (
                tooltipItem.label + ": " + Math.round(tooltipItem.raw) + "만원"
              );
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return value.toLocaleString() + "만원";
            },
            maxTicksLimit: 10,
          },
        },
      },
    },
  });
}
