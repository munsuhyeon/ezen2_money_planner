// 모든 스크롤 이벤트---------------------------------------------------------
// header 요소를 선택합니다.
const headerEl = document.querySelector("header");

// 스크롤 이벤트가 발생할 때 scrollHandler 함수를 throttle하여 호출합니다.
window.addEventListener("scroll", throttle(scrollHandler, 200));

// 스크롤 이벤트 핸들러 함수
function scrollHandler() {
  // 현재 브라우저의 스크롤 위치를 구합니다.
  let browserScrollY = window.scrollY || window.pageYOffset;

  // 브라우저의 스크롤 위치가 0보다 크고, 헤더에 'active' 클래스가 없는 경우
  if (browserScrollY > 0 && !headerEl.classList.contains("active")) {
    // 헤더에 'active' 클래스를 추가합니다.
    headerEl.classList.add("active");
  }
  // 브라우저의 스크롤 위치가 0이고, 헤더에 'active' 클래스가 있는 경우
  else if (browserScrollY === 0 && headerEl.classList.contains("active")) {
    // 헤더에서 'active' 클래스를 제거합니다.
    headerEl.classList.remove("active");
  }

  // 카드들 fade효과
  let Main2Cards = document.querySelectorAll(`#Main-2 .Main2_card`);
  let MainCard = document.querySelector(`#Main-2`).offsetTop;
  let Main3Cards = document.querySelectorAll(`#Main-3 .Main3-Graph1`);
  let Main3Card = document.querySelector(`#Main-3`).offsetTop;
  let Main4Cards = document.querySelectorAll(`#Main-4 .Main4-Graph2`);
  let Main4Card = document.querySelector(`#Main-4`).offsetTop;

  Main2Cards.forEach(function (card) {
    if (window.scrollY >= MainCard - 300) {
      card.classList.add(`fade-up`);
    } else {
      card.classList.remove(`fade-up`);
    }
  });

  Main3Cards.forEach(function (card) {
    if (window.scrollY >= Main3Card - 300) {
      card.classList.add(`fade-in`);
    } else {
      card.classList.remove(`fade-in`);
    }
  });

  Main4Cards.forEach(function (card) {
    if (window.scrollY >= Main4Card - 300) {
      card.classList.add(`fade-in`);
    } else {
      card.classList.remove(`fade-in`);
    }
  });
}

// 스크롤 이벤트를 일정 시간 간격으로 제한하는 throttle 함수
function throttle(func, limit) {
  let lastFunc; // 마지막으로 호출된 함수를 저장하는 변수
  let lastRan; // 마지막으로 호출된 시간을 저장하는 변수

  return function () {
    const context = this;
    const args = arguments;

    // 처음 호출될 때는 바로 함수를 실행하고, 마지막 호출 시간을 저장합니다.
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    }
    // 이미 호출된 적이 있으면 이전에 설정된 타임아웃을 취소하고 새로운 타임아웃을 설정합니다.
    else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        // 마지막 호출 후 지정된 시간(limit)이 경과한 경우에만 함수를 실행합니다.
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan)); // 남은 시간만큼 타임아웃을 설정합니다.
    }
  };
}

// 스크롤 이벤트가 발생할 때 scrollHandler 함수를 throttle하여 호출합니다.
window.addEventListener("scroll", throttle(scrollHandler, 200));

// ------------------------------------------------------------------------------------------------------
// 막대그래프
document.addEventListener("DOMContentLoaded", function () {
  let chartInstances = {}; // 차트 인스턴스를 저장할 객체

  // 공통 차트 생성 함수
  function createChart(
    ctx,
    labels,
    dataValues,
    label,
    backgroundColor,
    borderColor
  ) {
    const data = {
      labels: labels,
      datasets: [
        {
          label: label,
          data: dataValues, // 데이터 값
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };

    const config = {
      type: "bar",
      data: data,
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
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
      },
    };

    return new Chart(ctx, config); // 차트 인스턴스를 반환
  }

  // 차트를 삭제하는 함수
  function destroyChart(chart) {
    if (chart) {
      chart.destroy();
    }
  }

  // 차트를 생성하는 함수 호출을 위한 Intersection Observer 설정
  function setupObserver(
    elementId,
    labels,
    dataValues,
    label,
    backgroundColor,
    borderColor
  ) {
    const element = document.getElementById(elementId);
    const ctx = element.getContext("2d");
    let chart = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!chart) {
              chart = createChart(
                ctx,
                labels,
                dataValues,
                label,
                backgroundColor,
                borderColor
              );
              chartInstances[elementId] = chart;
            }
          } else {
            if (chart) {
              destroyChart(chart);
              chartInstances[elementId] = null;
              chart = null;
            }
          }
        });
      },
      { threshold: 0.1 } // 요소가 10% 이상 보이면 콜백 실행
    );

    observer.observe(element);
  }

  // 각 차트에 대한 Observer 설정
  setupObserver(
    "barChart1",
    ["카페", "식비", "생활비"],
    [5, 15, 80],
    "최근거래내역",
    [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
    ],
    ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"]
  );

  setupObserver(
    "barChart2",
    ["카페", "식비", "생활비"],
    [5, 15, 80],
    "잦은지출내역",
    [
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
    ],
    ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"]
  );
});

// ------------------------------------------------------------------------------------------------------
// 원 그래프
document.addEventListener("DOMContentLoaded", function () {
  let chartInstances = {}; // 차트 인스턴스를 저장할 객체

  // 공통 차트 생성 함수
  function createChart(
    ctx,
    labels,
    dataValues,
    label,
    backgroundColor,
    borderColor
  ) {
    const data = {
      labels: labels,
      datasets: [
        {
          label: label,
          data: dataValues, // 데이터 값
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };

    const config = {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
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
      },
    };

    return new Chart(ctx, config); // 차트 인스턴스를 반환
  }

  // 차트를 삭제하는 함수
  function destroyChart(chart) {
    if (chart) {
      chart.destroy();
    }
  }

  // 차트를 생성하는 함수 호출을 위한 Intersection Observer 설정
  function setupObserver(
    elementId,
    labels,
    dataValues,
    label,
    backgroundColor,
    borderColor
  ) {
    const element = document.getElementById(elementId);
    const ctx = element.getContext("2d");
    let chart = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!chart) {
              chart = createChart(
                ctx,
                labels,
                dataValues,
                label,
                backgroundColor,
                borderColor
              );
              chartInstances[elementId] = chart;
            }
          } else {
            if (chart) {
              destroyChart(chart);
              chartInstances[elementId] = null;
              chart = null;
            }
          }
        });
      },
      { threshold: 0.1 } // 요소가 10% 이상 보이면 콜백 실행
    );

    observer.observe(element);
  }

  // 각 차트에 대한 Observer 설정
  setupObserver(
    "pieChart",
    ["홍보", "개발", "운영"],
    [30, 50, 20],
    "예산 분포",
    [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
    ],
    ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"]
  );

  setupObserver(
    "pieChart2",
    ["카페", "식비", "생활비"],
    [5, 15, 80],
    "예산 분포",
    [
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
    ],
    ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"]
  );
});

// 무한롤링 배너 -------------------------------------------------------------------------------------
let roller = document.querySelector(".rolling-list");
roller.id = "roller1"; // 아이디 부여

let clone = roller.cloneNode(true);
// cloneNode : 노드 복제. 기본값은 false. 자식 노드까지 복제를 원하면 true 사용
clone.id = "roller2";
document.querySelector(".AllTipCard").appendChild(clone); // wrap 하위 자식으로 부착

document.querySelector("#roller1").style.left = "0px";
document.querySelector("#roller2").style.left =
  document.querySelector(".rolling-list ul").offsetWidth + "px";
// offsetWidth : 요소의 크기 확인(margin을 제외한 padding값, border값까지 계산한 값)

roller.classList.add("original");
clone.classList.add("clone");

// 알림창 -------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var notificationIcon = document.getElementById("notification-icon");
  var notification = document.getElementById("notification");
  var closeNotificationButton = document.getElementById("close-notification");
  var notificationBadge = document.getElementById("notification-badge");

  // 알림 아이콘 클릭 시 알림 창 토글
  notificationIcon.addEventListener("click", function (event) {
    notification.classList.toggle("active");
    event.stopPropagation(); // 클릭 이벤트가 문서로 전파되지 않도록 함
  });

  // 닫기 버튼 클릭 시 알림 창 닫기
  closeNotificationButton.addEventListener("click", function (event) {
    notification.classList.remove("active");
    event.stopPropagation(); // 클릭 이벤트가 문서로 전파되지 않도록 함
  });

  // 문서의 클릭 이벤트를 감지하여 알림 창 닫기
  document.addEventListener("click", function (event) {
    if (
      !notification.contains(event.target) &&
      !notificationIcon.contains(event.target)
    ) {
      notification.classList.remove("active");
    }
  });
});

// 스크롤탑,바텀 ------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // "맨 위로 스크롤" 버튼 요소를 선택합니다.
  var scrollTopButton = document.getElementById("scroll-top");
  // "맨 아래로 스크롤" 버튼 요소를 선택합니다.
  var scrollBottomButton = document.getElementById("scroll-bottom");

  // 버튼을 토글하는 함수입니다.
  function toggleButtons() {
    // 스크롤 위치가 100px 이상일 때
    if (window.scrollY > 100) {
      // "맨 위로 스크롤" 버튼을 보이도록 합니다.
      scrollTopButton.classList.add("show");
      // "맨 위로 스크롤" 버튼에 클릭 이벤트 리스너를 추가합니다.
      scrollTopButton.addEventListener("click", scrollToTop);
    } else {
      // 그렇지 않으면 "맨 위로 스크롤" 버튼을 숨깁니다.
      scrollTopButton.classList.remove("show");
      // "맨 위로 스크롤" 버튼에서 클릭 이벤트 리스너를 제거합니다.
      scrollTopButton.removeEventListener("click", scrollToTop);
    }

    // 스크롤 위치가 100px 이상일 때
    if (window.scrollY > 100) {
      // "맨 아래로 스크롤" 버튼을 보이도록 합니다.
      scrollBottomButton.classList.add("show");
      // "맨 아래로 스크롤" 버튼에 클릭 이벤트 리스너를 추가합니다.
      scrollBottomButton.addEventListener("click", scrollToBottom);
    } else {
      // 그렇지 않으면 "맨 아래로 스크롤" 버튼을 숨깁니다.
      scrollBottomButton.classList.remove("show");
      // "맨 아래로 스크롤" 버튼에서 클릭 이벤트 리스너를 제거합니다.
      scrollBottomButton.removeEventListener("click", scrollToBottom);
    }
  }

  // 페이지를 맨 위로 스크롤하는 함수입니다.
  function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // 페이지를 맨 아래로 스크롤하는 함수입니다.
  function scrollToBottom(e) {
    e.preventDefault();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  // 스크롤 이벤트 리스너를 추가하여 페이지 스크롤 위치를 모니터링합니다.
  window.addEventListener("scroll", toggleButtons);

  // 초기 버튼 상태를 설정합니다.
  toggleButtons();
});
