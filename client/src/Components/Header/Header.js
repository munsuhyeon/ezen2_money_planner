import "./Header.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { TransactionListContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import ScrollEvent from "../../Hooks/Main/ScrollEvent";

const Header = () => {
  const { transactionList } = useContext(TransactionListContext);
  const { headerRef } = ScrollEvent();
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const notificationIconRef = useRef(null);
  const notificationRef = useRef(null);

  const userId = "test123"; // 예제 userId, 실제로는 Context 등에서 가져와야 함
  const userBudget = 10000; // 예제 예산, 실제로는 Context 등에서 가져와야 함

  const toggleNotification = (event) => {
    setNotificationVisible((prev) => !prev);
    if (!isNotificationVisible) {
      setUnreadNotificationCount(0); // 알림을 열 때 읽지 않은 알림 개수 초기화
    }
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

  const checkBudget = (budget, expenses) => {
    const totalExpenses = expenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
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
    if (newNotifications.length === 0) return;

    const listString = localStorage.getItem(`${userId}`);
    let storageList = [];
    if (listString) {
      storageList = JSON.parse(listString);
    }

    const newNotificationTitles = newNotifications
      .map((n) => n.title + n.detail)
      .join();
    const existingNotifications = storageList.filter(
      (notification) =>
        !newNotificationTitles.includes(
          notification.title + notification.detail
        )
    );

    const updatedNotifications = [
      ...newNotifications.map((notification) => ({
        ...notification,
        timestamp: Date.now(),
      })),
      ...existingNotifications,
    ];

    localStorage.setItem(`${userId}`, JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);

    // 읽지 않은 알림 개수는 새로 추가된 알림의 개수만 카운트
    setUnreadNotificationCount(
      (prevCount) => prevCount + newNotifications.length
    );
  };

  useEffect(() => {
    const newNotifications = checkBudget(userBudget, transactionList);
    addNotifications(newNotifications);
  }, [transactionList]);

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const handleMonthChange = () => {
      const storedNotifications = localStorage.getItem(`${userId}`);
      if (storedNotifications) {
        let parsedNotifications = JSON.parse(storedNotifications);
        if (!Array.isArray(parsedNotifications)) {
          parsedNotifications = [parsedNotifications];
        }
        parsedNotifications = parsedNotifications.filter(
          (notification) =>
            new Date(notification.timestamp).getMonth() === currentMonth &&
            new Date(notification.timestamp).getFullYear() === currentYear
        );
        localStorage.setItem(`${userId}`, JSON.stringify(parsedNotifications));
        setNotifications(parsedNotifications);
        // 새로 고침 시 읽지 않은 알림 개수 업데이트
        if (!isNotificationVisible) {
          setUnreadNotificationCount(parsedNotifications.length);
        }
      }
    };

    handleMonthChange();

    const intervalId = setInterval(() => {
      const now = new Date();
      if (now.getDate() === 1) {
        handleMonthChange();
      }
    }, 1000 * 60 * 60 * 24);

    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteNotification = (index) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    localStorage.setItem(`${userId}`, JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);

    // 삭제 후 읽지 않은 알림 개수 재조정
    setUnreadNotificationCount((prevCount) => prevCount - 1);
  };

  return (
    <header>
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
              {unreadNotificationCount > 0 && (
                <div className="notification-badge" id="notification-badge">
                  {unreadNotificationCount}
                </div>
              )}
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
                          <div className="notification-item-content">
                            <p className="notification-item-title">
                              {notification.title}
                            </p>
                            <p className="notification-item-time">
                              {new Date(
                                notification.timestamp
                              ).toLocaleString()}
                            </p>
                            <p
                              className="notification-item-detail"
                              dangerouslySetInnerHTML={{
                                __html: notification.detail,
                              }}
                            ></p>
                          </div>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteNotification(index)}
                          >
                            &times;
                          </button>
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
