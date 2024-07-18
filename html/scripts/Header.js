// Header 조금이라도 scroll하면 배경색 추가, 삭제
// ---------------------------------Header---------------------------------
const headerEl = document.querySelector("header");

window.addEventListener("scroll", throttle(scrollHandler, 200));

function scrollHandler() {
  let browserScrollY = window.scrollY || window.pageYOffset;
  if (browserScrollY > 0 && !headerEl.classList.contains("active")) {
    headerEl.classList.add("active");
  } else if (browserScrollY === 0 && headerEl.classList.contains("active")) {
    headerEl.classList.remove("active");
  }
}

// 스크롤 이벤트를 일정 시간 간격으로 제한하는 throttle 함수
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
// ---------------------------------Header---------------------------------
