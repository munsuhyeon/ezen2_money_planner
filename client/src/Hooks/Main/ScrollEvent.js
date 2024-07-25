import React, { useEffect, useRef } from "react";

// 스로틀 함수 정의
const throttle = (func, limit) => {
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
};

const ScrollHandler = () => {
  // 참조할 요소들
  const headerRef = useRef(null);
  const main2Ref = useRef(null);
  const main3Ref = useRef(null);
  const main4Ref = useRef(null);

  // 스크롤 이벤트 핸들러
  const scrollHandler = () => {
    const browserScrollY = window.scrollY || window.pageYOffset;

    // 헤더의 'active' 클래스 토글
    if (headerRef.current) {
      if (
        browserScrollY > 0 &&
        !headerRef.current.classList.contains("active")
      ) {
        headerRef.current.classList.add("active");
      } else if (
        browserScrollY === 0 &&
        headerRef.current.classList.contains("active")
      ) {
        headerRef.current.classList.remove("active");
      }
    }

    // 카드 fade 효과
    const Main2Cards = main2Ref.current?.querySelectorAll(".Main2_card") || [];
    const MainCard = main2Ref.current?.offsetTop || 0;
    const Main3Cards =
      main3Ref.current?.querySelectorAll(".Main3-Graph1") || [];
    const Main3Card = main3Ref.current?.offsetTop || 0;
    const Main4Cards =
      main4Ref.current?.querySelectorAll(".Main4-Graph2") || [];
    const Main4Card = main4Ref.current?.offsetTop || 0;

    Main2Cards.forEach((card) => {
      if (browserScrollY >= MainCard - 300) {
        card.classList.add("fade-up");
      } else {
        card.classList.remove("fade-up");
      }
    });

    Main3Cards.forEach((card) => {
      if (browserScrollY >= Main3Card - 300) {
        card.classList.add("fade-in");
      } else {
        card.classList.remove("fade-in");
      }
    });
    Main4Cards.forEach((card) => {
      if (browserScrollY >= Main4Card - 300) {
        card.classList.add("fade-in");
      } else {
        card.classList.remove("fade-in");
      }
    });
  };

  useEffect(() => {
    const throttledScrollHandler = throttle(scrollHandler, 200);

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", throttledScrollHandler);

    // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
    };
  }, []);

  return {
    headerRef,
    main2Ref,
    main3Ref,
    main4Ref,
  };
};

export default ScrollHandler;
