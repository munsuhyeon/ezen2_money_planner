import "./Header.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { TransactionListContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import ScrollEvent from "../../Hooks/Main/ScrollEvent";
// 날짜 계산을 위해 date-fns 라이브러리를 불러옵니다.
import { startOfMonth, endOfMonth } from "date-fns";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // 트랜잭션 리스트 컨텍스트에서 트랜잭션 리스트를 가져옵니다.
  const { transactionList } = useContext(TransactionListContext);
  // 스크롤 이벤트 커스텀 훅을 사용하여 headerRef를 가져옵니다.
  const { headerRef } = ScrollEvent();

  // 알림 창의 표시 상태를 관리하는 state입니다.
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  // 알림 목록을 관리하는 state입니다.
  const [notifications, setNotifications] = useState([]);
  // 읽지 않은 알림의 수를 관리하는 state입니다.
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  // 새로 추가된 알림의 수를 관리하는 state입니다.
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  // 알림 아이콘의 DOM 참조를 저장하기 위한 ref입니다.
  const notificationIconRef = useRef(null);
  // 알림 창의 DOM 참조를 저장하기 위한 ref입니다.
  const notificationRef = useRef(null);

  // 로컬스토리지에서 userId를 가져옵니다.
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  // 로그인 여부 확인
  const [loggedIn, setLoggedIn] = useState(false);
  // console.log(user)
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

  const navigate = useNavigate();

  // 로그아웃 함수
  const reqLogout = () => {
    localStorage.removeItem("user");
    setUserId(""); // 로그아웃 시 userId 상태를 초기화합니다.
    setUsername(""); // 로그아웃 시 username 상태를 초기화합니다.
    setLoggedIn(false); // 로그인 상태를 false로 설정합니다.
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  // 로그아웃 버튼에 들어갈 로그인페이지로 이동 함수

  function loginPage() {
    navigate("/login");
  }

  function Signup() {
    navigate("/signup");
  }

  useEffect(() => {
    console.log("Header 컴포넌트 업데이트:", { userId, username, loggedIn });
  }, [userId, username, loggedIn]);

  useEffect(() => {
    const storageData = localStorage.getItem("user");
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      setUserId(parsedData.userid);
      setUsername(parsedData.username);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn]);

  // 테스트를 위한 가예산입니다.
  const userBudget = 50000;

  // 알림 아이콘 클릭 시 알림 창을 토글하는 함수입니다.
  const toggleNotification = (event) => {
    setNotificationVisible((prev) => !prev);
    if (!isNotificationVisible) {
      // 알림 창이 열리면 새 알림 수를 0으로 초기화합니다.
      setNewNotificationCount(0);
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
    // 문서 전체에 클릭 이벤트 리스너를 추가합니다.
    document.addEventListener("click", handleDocumentClick);

    // 컴포넌트가 언마운트될 때 (또는 이펙트가 재실행될 때)
    // 클릭 이벤트 리스너를 제거합니다.
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
    // 빈 의존성 배열을 사용하여 컴포넌트가 처음 마운트될 때만 이펙트가 실행되도록 합니다.
  }, []);

  // 예산과 지출 내역을 비교하여 알림을 생성하는 함수입니다.
  const checkBudget = (budget, expenses) => {
    const now = new Date();
    // 이번 달의 시작 날짜를 계산합니다.
    const startOfThisMonth = startOfMonth(now);
    // 이번 달의 마지막 날짜를 계산합니다.
    const endOfThisMonth = endOfMonth(now);

    // 이번 달의 총 지출을 계산합니다.
    const totalExpenses = expenses
      // expense 타입의 거래만 필터링합니다.
      .filter((item) => item.incomeType === "expense")
      // 현재 월 내에 발생한 거래만 필터링합니다.
      .filter(
        (item) =>
          // item.transactionDate를 Date 객체로 변환 후 날짜가  startOfThisMonth,  endOfThisMonth 사이에 있는지 확인합니다.
          new Date(item.transactionDate) >= startOfThisMonth &&
          new Date(item.transactionDate) <= endOfThisMonth
      )
      // 각 거래의 금액을 핪나하여 총 지출 금액을 계산합니다.
      .reduce((acc, expense) => acc + expense.amount, 0);

    // 새로운 알림을 추가할 배열을 초기화합니다.
    const notificationsToAdd = [];

    // 예산을 초과한 경우 알림을 추가합니다.
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

  // 새로운 알림을 추가하는 함수입니다.
  const addNotifications = (newNotifications) => {
    // 추가할 새로운 알림이 없는 경우 함수 종료
    if (newNotifications.length === 0) return;

    // 로컬 스토리지에서 사용자 알림 목록을 가져옵니다.
    const listString = localStorage.getItem(`${userId}_notifications`);
    let storageList = [];
    if (listString) {
      storageList = JSON.parse(listString);
    }

    const newNotificationTitles = newNotifications.map(
      // 새로운 알림의 제목과 내용을 결합한 문자열 배열을 생성합니다.
      (n) => n.title + n.detail
    );

    // 중복을 제거하고 새로운 알림을 상단에 추가하여 업데이트된 알림 목록을 생성합니다.
    const updatedNotifications = [
      // 새로운 알림 목록을 추가합니다.
      ...newNotifications.map((notification) => ({
        ...notification,
        // 현재 시간을 타임스탬프로 추가합니다.
        timestamp: Date.now(),
        // 읽음 상태를 false로 설정합니다.
        read: false,
      })),
      // 기존 알림 목록에서 새 알림 목록에 포함되지 않은 알림들을 필터링하여 추가합니다.
      ...storageList.filter(
        (notification) =>
          // 새 알림 목록에 해당 알림의 제목과 세부 정보를 결합한 문자열이 포함되어 있지 않은 경우에만 해당 알림을 유지합니다.
          !newNotificationTitles.includes(
            notification.title + notification.detail
          )
      ),
      // 타임스탬프를 기준으로 알림을 내림차순으로 정렬합니다.
    ].sort((a, b) => b.timestamp - a.timestamp);

    // 새로운 알림의 수를 계산합니다.
    const newNotificationCount = newNotifications.length;

    // 로컬 스토리지에 업데이트된 알림 목록을 저장합니다.
    localStorage.setItem(
      `${userId}_notifications`,
      JSON.stringify(updatedNotifications)
    );

    setUnreadNotificationCount(
      // 읽지 않은 알림의 수를 업데이트합니다.
      updatedNotifications.filter((notification) => !notification.read).length
    );
    // 새로운 알림의 수를 업데이트합니다.
    setNewNotificationCount((prevCount) => prevCount + newNotificationCount);
    // 알림 목록을 업데이트합니다.
    setNotifications(updatedNotifications);
  };

  // 컴포넌트가 마운트될 때 저장된 알림을 불러오는 함수입니다.
  useEffect(() => {
    const loadNotifications = () => {
      // 사용자 ID를 기반으로 로컬 저장소에서 알림 데이터를 가져옵니다.
      const storedNotifications = localStorage.getItem(
        `${userId}_notifications`
      );

      // 로컬 저장소에서 알림 데이터가 존재하는지 확인합니다.
      if (storedNotifications) {
        // 로컬 저장소에서 가져온 JSON 문자열을 객체로 변환합니다.
        const parsedNotifications = JSON.parse(storedNotifications);
        // 상태를 업데이트하여 알림 목록을 설정합니다.
        setNotifications(parsedNotifications);
        // 읽지 않은 알림의 개수를 계산하여 상태를 업데이트합니다.
        setUnreadNotificationCount(
          // 읽지 않은 알림의 개수를 계산합니다.
          parsedNotifications.filter((notification) => !notification.read)
            .length
        );
      }
    };
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  // 트랜잭션 리스트가 변경될 때 예산을 확인하고 알림을 추가하는 함수입니다.
  useEffect(() => {
    if (userId) {
      const newNotifications = checkBudget(userBudget, transactionList);
      addNotifications(newNotifications);
    }
  }, [transactionList, userId]);

  // 알림을 삭제하는 함수입니다.
  const handleDeleteNotification = (index) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    // 로컬 스토리지에 업데이트된 알림 목록을 저장합니다.
    localStorage.setItem(
      `${userId}_notifications`,
      JSON.stringify(updatedNotifications)
    );
    // 알림 목록을 업데이트합니다.

    // 상태 업데이트
    setNotifications(updatedNotifications);
    // 읽지 않은 알림의 수를 업데이트합니다.
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
                    // 알림에 내용이 없을 때만 띄워줍니다.
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
