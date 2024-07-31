import "./Header.css";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import ScrollEvent from "../../Hooks/Main/ScrollEvent";

const Header = () => {
  const { headerRef } = ScrollEvent();
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationIconRef = useRef(null);
  const notificationRef = useRef(null);

  // 고정된 테스트용 데이터
  const userId = "test_user1";
  const userBudget = 1000; // 예산 설정
  const [userExpenses] = useState([
    // 비용 설정
    { amount: 600 },
  ]);

  const toggleNotification = (event) => {
    setNotificationVisible((prev) => !prev);
    event.stopPropagation();
  };

  const closeNotification = (event) => {
    setNotificationVisible(false);
    event.stopPropagation();
  };

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
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 알림 데이터 가져오기
    const storedNotifications = localStorage.getItem(`notifications_${userId}`);
    if (storedNotifications) {
      let parsedNotifications = JSON.parse(storedNotifications);
      if (!Array.isArray(parsedNotifications)) {
        parsedNotifications = [parsedNotifications];
      }
      // 시간순으로 정렬 (가장 최근의 알림이 맨 위로 오게)
      parsedNotifications.sort((a, b) => b.timestamp - a.timestamp);

      setNotifications(parsedNotifications);
    }
  }, []);

  const checkBudget = (budget, expenses) => {
    const totalExpenses = expenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );

    // 예산 상태에 따라 알림 추가
    const notificationsToAdd = [];
    if (totalExpenses > budget) {
      notificationsToAdd.push({
        title: "예산 초과",
        detail: "<span class='highlight'>설정하신 예산을 초과했어요. 🙀</span>",
      });
    } else if (totalExpenses === budget) {
      notificationsToAdd.push({
        title: "예산 경고",
        detail:
          "<span class='highlight'>설정하신 예산을 전부 사용하셨어요.😹</span>",
      });
    } else if (totalExpenses >= budget * 0.9) {
      notificationsToAdd.push({
        title: "예산 경고",
        detail:
          "설정하신 <span class='highlight'>예산의 90%에 도달</span>했어요.😿",
      });
    } else if (totalExpenses >= budget * 0.5) {
      notificationsToAdd.push({
        title: "예산 경고",
        detail:
          "설정하신 <span class='highlight'>예산의 50%에 도달</span>했어요.😽",
      });
    }

    return notificationsToAdd;
  };

  const addNotifications = (newNotifications) => {
    if (newNotifications.length === 0) return; // 새로운 알림이 없으면 종료

    // 로컬스토리지에서 기존의 알림 가져오기
    const listString = localStorage.getItem(`notifications_${userId}`);
    let storageList = [];
    if (listString) {
      storageList = JSON.parse(listString);
    }

    // 중복 체크: 같은 내용의 알림이 이미 있는지 확인
    const newNotificationTitles = newNotifications
      .map((n) => n.title + n.detail)
      .join();
    const existingNotifications = storageList.filter(
      (notification) =>
        !newNotificationTitles.includes(
          notification.title + notification.detail
        )
    );

    // 새로운 알림을 리스트의 맨 앞에 추가
    const updatedNotifications = [
      ...newNotifications.map((notification) => ({
        ...notification,
        timestamp: Date.now(),
      })),
      ...existingNotifications,
    ];

    // 로컬 스토리지에 유효한 알림 데이터 저장
    localStorage.setItem(
      `notifications_${userId}`,
      JSON.stringify(updatedNotifications)
    );

    // 상태 업데이트
    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    // 예산 및 비용 데이터가 변경될 때마다 예산 상태 평가
    const newNotifications = checkBudget(userBudget, userExpenses);

    // 새로운 알림을 추가
    addNotifications(newNotifications);
  }, [userBudget, userExpenses]);

  useEffect(() => {
    // 예산 및 비용 데이터가 변경될 때마다 예산 상태 평가
    const newNotifications = checkBudget(userBudget, userExpenses);

    // 새로운 알림을 추가
    addNotifications(newNotifications);
  }, [userBudget, userExpenses]);

  useEffect(() => {
    // 매달 초에 알림 초기화
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const handleMonthChange = () => {
      // 로컬 스토리지에서 기존 알림을 가져와 현재 월의 알림만 남깁니다.
      const storedNotifications = localStorage.getItem(
        `notifications_${userId}`
      );
      if (storedNotifications) {
        let parsedNotifications = JSON.parse(storedNotifications);
        if (!Array.isArray(parsedNotifications)) {
          parsedNotifications = [parsedNotifications];
        }

        // 현재 월의 알림만 남기고 이전 월의 알림은 제거
        parsedNotifications = parsedNotifications.filter(
          (notification) =>
            new Date(notification.timestamp).getMonth() === currentMonth &&
            new Date(notification.timestamp).getFullYear() === currentYear
        );

        // 로컬 스토리지에 현재 월의 알림만 저장
        localStorage.setItem(
          `notifications_${userId}`,
          JSON.stringify(parsedNotifications)
        );

        // 상태 업데이트
        setNotifications(parsedNotifications);
      }
    };

    handleMonthChange();

    // 매일 자정에 알림 상태를 초기화하는 함수 호출
    const intervalId = setInterval(() => {
      const now = new Date();
      if (now.getDate() === 1) {
        handleMonthChange();
      }
    }, 1000 * 60 * 60 * 24); // 24시간마다 체크

    return () => clearInterval(intervalId); // 클린업 함수
  }, []);

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
                {notifications.length}
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
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div className="notification-item" key={index}>
                        <div className="notification-item-info">
                          <p className="notification-item-title">
                            {notification.title}
                          </p>
                          <p className="notification-item-time">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                          <p
                            className="notification-item-detail"
                            dangerouslySetInnerHTML={{
                              __html: notification.detail,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="NotAlarm">알림이 없습니다.</p>
                  )}
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
