import "./Header.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { TransactionListContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import ScrollEvent from "../../Hooks/Main/ScrollEvent";
import { startOfMonth, endOfMonth } from "date-fns";
import { useNavigate } from "react-router-dom";
import { call } from "../../Components/service/ApiService";

// 특정 사용자의 특정 연도와 월에 대한 월별 예산을 가져오는 함수
const fetchMonthlyBudget = async (userId, year, month) => {
  try {
    // 서버에 월별 예산 데이터를 요청
    const response = await call(`/budget/${userId}/${year}/${month}`, "GET");
    // 응답이 있으면 반환, 없으면 기본값으로 반환
    return response || { monthlyBudget: 0, budgetId: null };
  } catch (error) {
    // 요청 중 오류가 발생하면 오류 메시지를 콘솔에 출력하고 기본값 반환
    console.error(`월별 예산 데이터 요청 오류:`, error.message);
    return { monthlyBudget: 0, budgetId: null };
  }
};

// 최근 1개월의 예산 데이터를 가져오는 함수
const fetchRecentOneMonthData = async (userId) => {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), 1);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return fetchMonthlyBudget(userId, year, month);
};

const Header = () => {
  const { transactionList, setTransactionList } = useContext(
    TransactionListContext
  );
  const { headerRef } = ScrollEvent();
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const notificationIconRef = useRef(null);
  const notificationRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [lastTransactionIds, setLastTransactionIds] = useState(new Set());
  const [userBudget, setUserBudget] = useState(0); // 예산 데이터를 저장할 상태 변수

  const navigate = useNavigate();

  useEffect(() => {
    // 로컬스토리지의 로그인한 사용자정보를 변수 user 에 담는다.
    const user = localStorage.getItem("user");
    // user의 데이터가 있다면 loggedIn = true, 데이터가 없다면 loggedIn = false
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  // 로그아웃 함수
  const reqLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem(`${userId}_lastTransactionIds`);
    localStorage.removeItem("kakao_token");
    setUserId("");
    setUsername("");
    setLoggedIn(false);
    setNotifications([]);
    setUnreadNotificationCount(0);
    setNewNotificationCount(0);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  function loginPage() {
    navigate("/login");
  }

  function Signup() {
    navigate("/signup");
  }

  useEffect(() => {
    //console.log("Header 컴포넌트 업데이트:", { userId, username, loggedIn });
  }, [userId, username, loggedIn]);

  useEffect(() => {
    const storageData = localStorage.getItem("user");
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      setUserId(parsedData.userid);
      setUsername(parsedData.username);
      setLoggedIn(true);
      loadNotifications(parsedData.userid); // 알림을 불러옵니다.
      const storedTransactionIds = localStorage.getItem(
        `${parsedData.userid}_lastTransactionIds`
      );
      if (storedTransactionIds) {
        setLastTransactionIds(new Set(JSON.parse(storedTransactionIds)));
      }
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn]);

  const toggleNotification = (event) => {
    setNotificationVisible((prev) => !prev);

    if (!isNotificationVisible) {
      // 알림 창이 열릴 때 모든 알림의 read 상태를 true로 설정합니다.
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }));

      setNotifications(updatedNotifications);
      setUnreadNotificationCount(0); // 읽지 않은 알림 수를 0으로 설정합니다.
      setNewNotificationCount(0); // 새 알림 수를 0으로 초기화합니다.

      // 로컬 스토리지에 업데이트된 알림을 저장합니다.
      localStorage.setItem(
        `${userId}_notifications`,
        JSON.stringify(updatedNotifications)
      );
    }

    // 이벤트 전파를 중지시킵니다.
    event.stopPropagation();
  };

  // 알림 창 닫기 버튼 클릭 시 알림 창을 닫는 함수입니다.
  const closeNotification = (event) => {
    setNotificationVisible(false);
    // 이벤트 전파를 중지시킵니다.
    event.stopPropagation();
  };

  // 알림창 이외의 곳을 클릭할 시 알림 창을 닫는 함수입니다.
  const handleDocumentClick = (event) => {
    // 알림 창(notificationRef)이 렌더링된 상태이고,
    // 클릭된 요소가 알림 창 내부가 아닌 경우
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      // 알림 창을 닫기 위해 알림 창의 가시성 상태를 false로 설정합니다.
      setNotificationVisible(false);
    }
  };

  // 컴포넌트가 마운트될 때와 언마운트될 때 이벤트 리스너를 설정합니다.
  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // 예산과 지출 내역을 비교하여 알림을 생성하는 함수입니다.
  const checkBudget = (budget, expenses) => {
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);

    // 이번 달의 총 지출을 계산합니다.
    const totalExpenses = expenses
      .filter((item) => item.incomeType === "expense")
      .filter(
        (item) =>
          new Date(item.transactionDate) >= startOfThisMonth &&
          new Date(item.transactionDate) <= endOfThisMonth
      )
      .reduce((acc, expense) => acc + expense.amount, 0);
    // 새로운 알림을 추가할 배열을 초기화합니다.
    const notificationsToAdd = [];

    // 예산을 초과한 경우 알림을 추가합니다.
    if (budget <= 0) {
      notificationsToAdd.push({
        title: "예산 없음",
        detail:
          "<span class='highlight'>설정되어있는 예산이 없습니다. 예산을 설정해주세요.😺</span>",
        triggerPercentage: 0,
      });
    } else if (totalExpenses > budget) {
      notificationsToAdd.push({
        title: "예산 초과",
        detail: "<span class='highlight'>설정하신 예산을 초과했어요. 🙀</span>",
        triggerPercentage: 100,
      });
    } else if (totalExpenses === budget) {
      notificationsToAdd.push({
        title: "예산 경고",
        detail:
          "<span class='highlight'>설정하신 예산을 전부 사용하셨어요.😹</span>",
        triggerPercentage: 100,
      });
    } else if (totalExpenses >= budget * 0.9) {
      notificationsToAdd.push({
        title: "예산 경고",
        detail:
          "설정하신 <span class='highlight'>예산의 90%에 도달</span>했어요.😿",
        triggerPercentage: 90,
      });
    } else if (totalExpenses >= budget * 0.5) {
      notificationsToAdd.push({
        title: "예산 경고",
        detail:
          "설정하신 <span class='highlight'>예산의 50%에 도달</span>했어요.😽",
        triggerPercentage: 50,
      });
    }

    return notificationsToAdd;
  };

  const loadNotifications = (userId) => {
    const storedNotifications = localStorage.getItem(`${userId}_notifications`);
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
      setUnreadNotificationCount(
        parsedNotifications.filter((notification) => !notification.read).length
      );
      setNewNotificationCount(
        parsedNotifications.filter((notification) => !notification.read).length
      );
    }
  };

  const addNotifications = (newNotifications) => {
    if (newNotifications.length === 0) return;

    const listString = localStorage.getItem(`${userId}_notifications`);
    let storageList = [];
    if (listString) {
      storageList = JSON.parse(listString);
    }

    // 중복 알림을 방지하기 위해 기존 알림과 비교합니다.
    const updatedNotifications = [
      ...storageList,
      ...newNotifications.map((notification) => ({
        ...notification,
        timestamp: Date.now(),
        read: false,
      })),
    ]
      .filter(
        (notif, index, self) =>
          index === self.findIndex((t) => t.timestamp === notif.timestamp)
      )
      .sort((a, b) => b.timestamp - a.timestamp);

    const newNotificationCount = newNotifications.length;

    localStorage.setItem(
      `${userId}_notifications`,
      JSON.stringify(updatedNotifications)
    );

    setUnreadNotificationCount(
      updatedNotifications.filter((notification) => !notification.read).length
    );
    setNewNotificationCount((prevCount) => prevCount + newNotificationCount);
    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const budgetData = await fetchRecentOneMonthData(userId);
          const mostRecentBudget = budgetData?.monthlyBudget || 0;

          setUserBudget(mostRecentBudget);

          const currentTransactionIds = new Set(
            transactionList.map((txn) => txn.transactionId)
          );
          const isNewTransaction = [...currentTransactionIds].some(
            (id) => !lastTransactionIds.has(id)
          );

          if (isNewTransaction) {
            const newNotifications = checkBudget(
              mostRecentBudget,
              transactionList
            );

            const highestLevelNotification = newNotifications.reduce(
              (prev, curr) => {
                if (!prev) return curr;
                return curr.triggerPercentage > prev.triggerPercentage
                  ? curr
                  : prev;
              },
              null
            );

            const notificationsToAdd = highestLevelNotification
              ? [highestLevelNotification]
              : [];
            addNotifications(notificationsToAdd);
            setLastTransactionIds(currentTransactionIds);
            localStorage.setItem(
              `${userId}_lastTransactionIds`,
              JSON.stringify([...currentTransactionIds])
            );
          }
        } catch (error) {
          console.error("Error fetching budget data", error);
        }
      };

      fetchData();
    }
  }, [transactionList, userId, lastTransactionIds]);

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
              <>
                <li>{username || "닉네임"}</li>
                <li>
                  <button className="Header_logout" onClick={reqLogout}>
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <>
                <button className="Header_signup" onClick={Signup}>
                  회원가입
                </button>
                <button className="Header_logout" onClick={loginPage}>
                  로그인
                </button>
              </>
            )}
            <li>
              <FontAwesomeIcon
                id="notification-icon"
                icon={faBell}
                className="notification-icon"
                onClick={toggleNotification}
                ref={notificationIconRef}
              />
              {newNotificationCount > 0 && (
                <div className="notification-badge" id="notification-badge">
                  {newNotificationCount}
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
