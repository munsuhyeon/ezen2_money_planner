import "./Header.css";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import ScrollEvent from "../../Hooks/Main/ScrollEvent";

const Header = () => {
  const { headerRef } = ScrollEvent();
  // 헤더의 'active' 클래스 상태를 관리하는 useState 훅
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  // Ref를 사용하여 DOM 요소에 접근
  const notificationIconRef = useRef(null);
  const notificationRef = useRef(null);

  // 알림 아이콘 클릭 시 알림 창 토글
  const toggleNotification = (event) => {
    setNotificationVisible((prev) => !prev);
    event.stopPropagation(); // 클릭 이벤트가 문서로 전파되지 않도록 함
  };

  // 닫기 버튼 클릭 시 알림 창 닫기
  const closeNotification = (event) => {
    setNotificationVisible(false);
    event.stopPropagation(); // 클릭 이벤트가 문서로 전파되지 않도록 함
  };

  // 문서의 클릭 이벤트를 감지하여 알림 창 닫기
  const handleDocumentClick = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target) &&
      notificationIconRef.current &&
      !notificationIconRef.current.contains(event.target)
    ) {
      setNotificationVisible(false);
    }
  };

  useEffect(() => {
    // 문서의 클릭 이벤트 리스너를 추가합니다.
    document.addEventListener("click", handleDocumentClick);

    // 컴포넌트 언마운트 시 이벤트 리스너를 제거합니다.
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isNotificationVisible]); // isNotificationVisible 상태만 의존성으로 추가

  return (
    <header ref={headerRef}>
      <div className="Header_div">
        <div>
          <a href="#">
            <img src="/assets/logo/Thicklogo.png" alt="모으냥로고" />
          </a>
        </div>
        <div>
          <ul className="Header_Right">
            <li>닉네임</li>
            <li>
              <button className="Header_logout">로그아웃</button>
            </li>
            <li>
              <FontAwesomeIcon
                id="notification-icon"
                icon={faBell}
                className="notification-icon"
                onClick={toggleNotification}
                ref={notificationIconRef}
              />
              <div className="notification-badge" id="notification-badge">
                3
              </div>
              <div
                className={`notification ${
                  isNotificationVisible ? "active" : ""
                }`}
                ref={notificationRef}
              >
                <div className="notification-header">
                  <h2>알림</h2>
                  <button id="close-notification" onClick={closeNotification}>
                    &times;
                  </button>
                </div>
                <div className="notification-content">
                  <div className="notification-item">
                    <div className="notification-item-info">
                      <p className="notification-item-title">예산위험</p>
                      <p className="notification-item-time">7월 22일</p>
                      <p className="notification-item-detail">
                        설정하신 예산까지 얼마 안 남았습니다.
                      </p>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-item-info">
                      <p className="notification-item-title">예산초과</p>
                      <p className="notification-item-time">7월 22일</p>
                      <p className="notification-item-detail">
                        설정하신 예산을 초과하였습니다.
                      </p>
                    </div>
                  </div>
                  {/* 추가 알림 항목 여기에 추가 */}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
