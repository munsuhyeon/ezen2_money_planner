import "./Header.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { TransactionListContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import ScrollEvent from "../../Hooks/Main/ScrollEvent";

// 새로고침시 안읽은 알림이 아닌 새로운 알림만 뱃지로 추가해줌

const Header = () => {
  // TransactionListContext에서 거래 목록을 가져옴
  const { transactionList } = useContext(TransactionListContext);
  // ScrollEvent 훅을 통해 headerRef를 가져옴
  const { headerRef } = ScrollEvent();

  // 상태 변수들
  // 알림 창의 표시 여부
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  // 알림 목록
  const [notifications, setNotifications] = useState([]);
  // 읽지 않은 알림 개수
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  // 새로 추가된 알림 개수
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  // 알림 아이콘의 참조
  const notificationIconRef = useRef(null);
  // 알림 창의 참조
  const notificationRef = useRef(null);

  const userId = "test123"; // 예제 userId, 실제로는 Context 등에서 가져와야 함
  const userBudget = 10000; // 예제 예산, 실제로는 Context 등에서 가져와야 함

  // 알림 창을 열고 닫는 함수
  const toggleNotification = (event) => {
    // 1. 현재 알림 창의 표시 상태를 토글합니다
    setNotificationVisible((prev) => !prev);
    // 2. 알림 창이 열릴 때 새 알림 개수를 초기화합니다.
    if (!isNotificationVisible) {
      // 알림 창이 열릴 때 새 알림 개수 초기화
      setNewNotificationCount(0);
    }
    // 3. 클릭 이벤트가 상위 요소로 전파되지 않도록 막습니다.
    event.stopPropagation();
  };

  // 알림 창을 닫는 함수
  const closeNotification = (event) => {
    // 1. 알림 창을 닫습니다.
    setNotificationVisible(false);
    // 2. 클릭 이벤트의 전파를 막습니다.
    event.stopPropagation();
  };

  // 문서에서 클릭 이벤트가 발생할 때 알림 창이 닫히도록 하는 함수
  const handleDocumentClick = (event) => {
    // 1. 알림 창이 열려 있고, 클릭한 위치가 알림 창이나 알림 아이콘이 아닌 경우
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target) && // 클릭한 위치가 알림 창 내부가 아닌 경우
      notificationIconRef.current &&
      !notificationIconRef.current.contains(event.target) // 클릭한 위치가 알림 아이콘 내부가 아닌 경우
    ) {
      // 2. 알림 창을 닫습니다.
      setNotificationVisible(false);
    }
  };

  // 컴포넌트 마운트 시 클릭 이벤트 리스너 추가
  useEffect(() => {
    // 컴포넌트가 마운트될 때 'click' 이벤트 리스너를 문서에 추가합니다.
    document.addEventListener("click", handleDocumentClick);
    // 클린업 함수: 컴포넌트가 언마운트될 때 호출됩니다.
    // 이벤트 리스너를 제거하여 메모리 누수를 방지합니다.
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
    // 빈 배열을 의존성으로 사용하여 이 useEffect가
    // 컴포넌트의 처음 렌더링 시 한 번만 실행되도록 합니다.
  }, []);

  // 예산을 확인하고 알림을 생성하는 함수
  const checkBudget = (budget, expenses) => {
    // 총 지출 금액을 계산합니다.
    // expenses 배열의 각 요소에서 amount 속성을 추출하여 합계(acc)로 누적합니다.
    const totalExpenses = expenses.reduce(
      (acc, expense) => acc + expense.amount, // 누적값(acc)과 현재 지출(expense.amount)을 더합니다.
      0 // reduce 함수의 초기 값은 0입니다.
    );
    // 알림을 추가할 배열을 초기화합니다.
    const notificationsToAdd = [];

    // 예산과 총 지출 금액을 비교하여 알림을 생성합니다.
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

  // 새 알림을 추가하고 상태를 업데이트하는 함수
  const addNotifications = (newNotifications) => {
    // 새 알림이 없는 경우 함수 종료
    if (newNotifications.length === 0) return;

    // 로컬 스토리지에서 저장된 알림 목록을 가져옴
    const listString = localStorage.getItem(`${userId}`);
    console.log("Stored Notifications: ", listString); // 로컬 스토리지 확인
    // 로컬 스토리지에서 가져온 알림 목록을 파싱하여 배열로 변환
    let storageList = [];
    if (listString) {
      storageList = JSON.parse(listString);
    }

    // 새 알림 목록의 각 알림 제목과 세부 정보를 합쳐서 문자열로 생성
    const newNotificationTitles = newNotifications.map(
      (n) => n.title + n.detail
    );

    // 기존 알림 중 새로운 알림과 겹치는 알림을 제외한 목록을 생성
    const updatedNotifications = [
      // 새 알림 목록을 추가
      ...newNotifications.map((notification) => ({
        ...notification,
        timestamp: Date.now(), // 새 알림에 현재 시간을 타임스탬프로 추가
        read: false, // 새 알림은 기본적으로 읽지 않음 상태로 설정
      })),
      // 기존 알림 중에서 새 알림과 겹치지 않는 알림만 포함
      ...storageList.filter(
        (notification) =>
          !newNotificationTitles.includes(
            notification.title + notification.detail
          )
      ),
    ].sort((a, b) => b.timestamp - a.timestamp); // 최신 알림이 위로 오도록 정렬

    // 새로 추가된 알림의 개수 계산
    const newNotificationCount = newNotifications.length;

    // 업데이트된 알림 목록을 로컬 스토리지에 저장
    localStorage.setItem(`${userId}`, JSON.stringify(updatedNotifications));

    // 읽지 않은 알림 개수 업데이트
    setUnreadNotificationCount(
      updatedNotifications.filter((notification) => !notification.read).length
    );
    // 새 알림 개수 업데이트
    setNewNotificationCount((prevCount) => prevCount + newNotificationCount);

    // 상태를 업데이트하여 새 알림 목록을 설정
    setNotifications(updatedNotifications);
  };

  // 컴포넌트 마운트 시 로컬 스토리지에서 알림을 불러오는 함수
  useEffect(() => {
    // 알림을 로드하는 함수 정의
    const loadNotifications = () => {
      // 로컬 스토리지에서 저장된 알림 목록을 가져옴
      const storedNotifications = localStorage.getItem(`${userId}`);
      // 저장된 알림이 있는 경우
      if (storedNotifications) {
        // 문자열 형태로 저장된 알림 목록을 객체 배열로 파싱
        const parsedNotifications = JSON.parse(storedNotifications);
        // 파싱된 알림 목록을 상태로 설정
        setNotifications(parsedNotifications);
        // 읽지 않은 알림의 개수를 계산하여 상태로 설정
        setUnreadNotificationCount(
          parsedNotifications.filter((notification) => !notification.read)
            .length
        );
      }
    };
    // 컴포넌트가 마운트될 때 알림을 로드
    loadNotifications();
    // 빈 배열([])을 의존성 배열로 제공하므로, 컴포넌트가 처음 마운트될 때만 이 useEffect가 실행됩니다.
  }, []);

  // 거래 목록이 변경될 때 예산을 확인하고 알림을 추가
  useEffect(() => {
    // 트랜잭션 리스트를 콘솔에 출력하여 확인
    console.log("Transaction List: ", transactionList);
    // 현재 예산(userBudget)과 트랜잭션 리스트(transactionList)를 기반으로 새로운 알림을 생성
    const newNotifications = checkBudget(userBudget, transactionList);
    // 생성된 새로운 알림을 상태에 추가
    addNotifications(newNotifications);
    // 이 useEffect 훅은 transactionList가 변경될 때마다 실행됩니다.
  }, [transactionList]);

  // 알림을 삭제하는 함수
  const handleDeleteNotification = (index) => {
    // 현재 알림 목록에서 삭제할 알림을 제외한 새로운 목록 생성
    const updatedNotifications = notifications.filter((_, i) => i !== index);

    // 로컬 스토리지에 업데이트된 알림 목록 저장
    localStorage.setItem(`${userId}`, JSON.stringify(updatedNotifications));

    // 상태 업데이트
    setNotifications(updatedNotifications);
    setUnreadNotificationCount(
      updatedNotifications.filter((notification) => !notification.read).length
    ); // 삭제 후 읽지 않은 알림 개수 업데이트
  };

  return (
    <header ref={headerRef}>
      <div className="Header_div">
        <div>
          <a href="/">
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
