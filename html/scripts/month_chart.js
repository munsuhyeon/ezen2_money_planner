export function createCategoryChart() {
  const ctx = document.getElementById("category_chart");
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["식비", "주거비", "교통비", "의료비", "여가비", "기타"],
      datasets: [
        {
          data: [25, 25, 10, 15, 15, 10],
        },
      ],
    },
    options: {
      cutout: "70%",
      responsive: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            padding: 30,
          },
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: function (tooltipItem) {
              return (
                tooltipItem.label + ": " + Math.round(tooltipItem.raw) + "%"
              );
            },
          },
        },
      },
    },
  });
}

export function createPaymentMethodChart() {
  const pmctx = document.getElementById("payment_method");
  return new Chart(pmctx, {
    type: "doughnut",
    data: {
      labels: ["신용카드", "현금", "체크카드", "계좌이체"],
      datasets: [
        {
          data: [50, 5, 25, 20],
        },
      ],
    },
    options: {
      cutout: "70%",
      responsive: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            padding: 30,
          },
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: function (tooltipItem) {
              return (
                tooltipItem.label + ": " + Math.round(tooltipItem.raw) + "%"
              );
            },
          },
        },
      },
    },
  });
}

export function createLast3MonthsChart() {
  const l3mctx = document.getElementById("last_3_month");
  return new Chart(l3mctx, {
    type: "bar",
    data: {
      labels: ["5월", "6월", "7월"],
      datasets: [
        {
          data: [150, 200, 170],
          backgroundColor: ["rgb(175, 154, 223)"],
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
          callbacks: {
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
      barThickness: 40,
    },
  });
}

export function createTop3PayChart() {
  const t3mctx = document.getElementById("top_3_pay");
  return new Chart(t3mctx, {
    type: "bar",
    data: {
      labels: ["영화", "게임", "독서"],
      datasets: [
        {
          data: [150, 120, 100],
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
          callbacks: {
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
            maxTicksLimit: 8,
          },
        },
      },
      barThickness: 40,
    },
  });
}
