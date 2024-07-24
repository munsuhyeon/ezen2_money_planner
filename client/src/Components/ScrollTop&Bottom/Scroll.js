import { useEffect } from "react";
import "./Scroll.css";

const Scroll = () => {
  useEffect(() => {
    const handleScroll = () => {
      const ScrollTop = document.getElementById("scroll-top");
      const ScrollBottom = document.getElementById("scroll-bottom");

      // 스크롤 위치에 따라 버튼의 표시 여부를 설정합니다.
      if (window.scrollY > 100) {
        ScrollTop.classList.add("show");
        ScrollBottom.classList.add("show");
      } else {
        ScrollTop.classList.remove("show");
        ScrollBottom.classList.remove("show");
      }
    };

    // 스크롤 이벤트 리스너를 추가해줍니다.
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 스크롤 맨 위로 이동
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 스크롤 맨 아래로 이동
  const scrollToBottom = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <>
      <a href="#" id="scroll-top" onClick={scrollToTop}>
        ↑
      </a>
      <a href="#" id="scroll-bottom" onClick={scrollToBottom}>
        ↓
      </a>
    </>
  );
};

export default Scroll;
