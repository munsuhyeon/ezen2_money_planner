import "./Header.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { TransactionListContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import ScrollEvent from "../../Hooks/Main/ScrollEvent";
import { startOfMonth, endOfMonth } from "date-fns";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { transactionList } = useContext(TransactionListContext);
  const { headerRef } = ScrollEvent();

  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const notificationIconRef = useRef(null);
  const notificationRef = useRef(null);

  const userBudget = 50000;
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const storageData = localStorage.getItem("user");
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      setUserId(parsedData.userid);
      setUsername(parsedData.username);
      setLoggedIn(true);
      loadNotifications(parsedData.userid); // 알림 로드
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn]);

  const loadNotifications = (userId) => {
    const storedNotifications = JSON.parse(
      localStorage.getItem(`${userId}_notifications`) || "[]"
    );
    setNotifications(storedNotifications);
    setUnreadNotificationCount(
      storedNotifications.filter((notification) => !notification.read).length
    );
  };

  const reqLogout = () => {
    localStorage.removeItem("user");
    if (userId) {
      localStorage.removeItem(`${userId}_notifications`);
      localStorage.removeItem(`${userId}_previousTransactionList`);
    }
    setUserId("");
    setUsername("");
    setLoggedIn(false);
    setNotifications([]);
    setUnreadNotificationCount(0);
    setNewNotificationCount(0);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  const loginPage = () => {
    navigate("/login");
  };

  const Signup = () => {
    navigate("/signup");
  };

  useEffect(() => {
    console.log("Header 컴포넌트 업데이트:", { userId, username, loggedIn });
  }, [userId, username, loggedIn]);

  const toggleNotification = (event) => {
    if (!isNotificationVisible) {
      setUnreadNotificationCount(0);
      updateNotificationReadStatus();
    }
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
      !notificationRef.current.contains(event.target)
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
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);

    const totalExpenses = expenses
      .filter((item) => item.incomeType === "expense")
      .filter(
        (item) =>
          new Date(item.transactionDate) >= startOfThisMonth &&
          new Date(item.transactionDate) <= endOfThisMonth
      )
      .reduce((acc, expense) => acc + expense.amount, 0);

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

    const listString = localStorage.getItem(`${userId}_notifications`);
    let storageList = [];
    if (listString) {
      storageList = JSON.parse(listString);
    }

    const newNotificationTitles = newNotifications.map(
      (n) => n.title + n.detail
    );

    const updatedNotifications = [
      ...newNotifications.map((notification) => ({
        ...notification,
        timestamp: Date.now(),
        read: false,
      })),
      ...storageList.filter(
        (notification) =>
          !newNotificationTitles.includes(
            notification.title + notification.detail
          )
      ),
    ].sort((a, b) => b.timestamp - a.timestamp);

    const newNotificationCount = newNotifications.length;

    localStorage.setItem(
      `${userId}_notifications`,
      JSON.stringify(updatedNotifications)
    );

    setUnreadNotificationCount(
      (prevCount) =>
        prevCount +
        newNotifications.filter((notification) => !notification.read).length
    );
    setNewNotificationCount((prevCount) => prevCount + newNotificationCount);
    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    if (userId) {
      let previousTransactionList = JSON.parse(
        localStorage.getItem(`${userId}_previousTransactionList`) || "[]"
      );

      const newTransactions = transactionList.filter(
        (transaction) =>
          !previousTransactionList.some((prev) => prev.id === transaction.id) &&
          transaction.incomeType === "expense"
      );

      if (newTransactions.length > 0) {
        const newNotifications = checkBudget(userBudget, transactionList);
        addNotifications(newNotifications);
      }

      localStorage.setItem(
        `${userId}_previousTransactionList`,
        JSON.stringify(transactionList)
      );
    }
  }, [transactionList, userId]); // transactionList 변경 시마다 실행되도록 함

  const handleDeleteNotification = (index) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    localStorage.setItem(
      `${userId}_notifications`,
      JSON.stringify(updatedNotifications)
    );
    setNotifications(updatedNotifications);
    setUnreadNotificationCount(
      updatedNotifications.filter((notification) => !notification.read).length
    );
  };

  const markNotificationAsRead = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = true;

    localStorage.setItem(
      `${userId}_notifications`,
      JSON.stringify(updatedNotifications)
    );

    setNotifications(updatedNotifications);
    setUnreadNotificationCount(
      updatedNotifications.filter((notification) => !notification.read).length
    );
  };

  const updateNotificationReadStatus = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    localStorage.setItem(
      `${userId}_notifications`,
      JSON.stringify(updatedNotifications)
    );
    setNotifications(updatedNotifications);
  };

  return (
    <header ref={headerRef}>
      <div className="Header_div">
        <div>
          {loggedIn ? (
            <a href="/main">
              <img src="/assets/logo/Thicklogo.png" alt="모으냥로고" />
            </a>
          ) : (
            <a href="/">
              <img src="/assets/logo/Thicklogo.png" alt="모으냥로고" />
            </a>
          )}
        </div>
        <div>
          <ul className="Header_Right">
            {loggedIn ? (
              <li>{username || "닉네임"}</li>
            ) : (
              <button className="Header_signup" onClick={Signup}>
                회원가입
              </button>
            )}
            <li>
              {loggedIn ? (
                <button className="Header_logout" onClick={reqLogout}>
                  로그아웃
                </button>
              ) : (
                <button className="Header_logout" onClick={loginPage}>
                  로그인
                </button>
              )}
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
