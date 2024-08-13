import React, { useEffect, useState, useContext } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { TransactionListContext, UserIdContext } from "../../App";
import "./SideNav.css";
import { formatMonth } from "../../Utils/Utils";
import { call } from "../service/ApiService";

const SideNav = () => {
  const { getTransactionList } = useContext(TransactionListContext);
  const userId = useContext(UserIdContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [hasBudget, setHasBudget] = useState(null); // 상태를 null로 초기화
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태를 관리
  const [pendingPage, setPendingPage] = useState(null); // 클릭 시 이동할 페이지를 저장

  // 사용자 ID 변경 감지 및 예산 데이터 확인
  useEffect(() => {
    const checkBudget = async () => {
      if (!userId) return;
      setIsLoading(true); // 데이터 로딩 시작
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1 필요
        const response = await call(
          `/budget/${userId}/${year}/${month}`,
          "GET"
        );
        setHasBudget(response?.monthlyBudget > 0); // 예산 데이터가 존재하는지 확인
      } catch (error) {
        console.error(`월별 예산 데이터 요청 오류: ${error.message}`);
        setHasBudget(false); // 오류 발생 시 예산이 없다고 처리
      } finally {
        setIsLoading(false); // 데이터 로딩 완료
      }
    };

    checkBudget();
  }, [userId]);

  // 페이지 이동 처리
  useEffect(() => {
    if (pendingPage !== null && !isLoading) {
      if (hasBudget === null) {
        // 예산 데이터가 아직 로딩 중일 때는 대기
        return;
      }
      navigate(
        hasBudget && pendingPage === "/budgetpage" ? "/budgetpage" : "/"
      );
      setPendingPage(null); // 페이지 이동 후 상태 초기화
    }
  }, [pendingPage, hasBudget, isLoading, navigate]);

  const handleClick = (item) => {
    if (item.to === "/budgetpage") {
      setPendingPage("/budgetpage"); // 클릭된 페이지를 대기 상태로 저장
    } else {
      navigate(item.to); // 다른 페이지의 경우 즉시 이동
    }
  };

  const navItems = [
    {
      to: "/main",
      imgSrc: "/assets/sideNav/document-svgrepo-com.svg",
      imgAlt: "대시보드아이콘",
      text: "대시보드",
    },
    {
      to: "/transactionList",
      imgSrc: "/assets/sideNav/table-of-contents-svgrepo-com.svg",
      imgAlt: "수입/지출아이콘",
      text: "수입/지출내역",
      onClick: () => getTransactionList(formatMonth(new Date()), userId),
    },
    {
      to: "/calendar",
      imgSrc: "/assets/sideNav/date-svgrepo-com.svg",
      imgAlt: "달력아이콘",
      text: "달력",
      onClick: () => getTransactionList(formatMonth(new Date()), userId),
    },
    {
      to: "/weekly-report",
      imgSrc: "/assets/sideNav/histogram-svgrepo-com.svg",
      imgAlt: "보고서아이콘",
      text: "주간 보고서",
    },
    {
      to: "/monthly-report",
      imgSrc: "/assets/sideNav/line-graph-svgrepo-com.svg",
      imgAlt: "보고서아이콘",
      text: "월간 보고서",
    },
    {
      to: "/budgetpage",
      imgSrc: "/assets/sideNav/user-svgrepo-com.svg",
      imgAlt: "예산설정아이콘",
      text: "예산 설정",
    },
  ];

  return (
    <nav className="Side_Nav">
      <ul>
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.to}
              className={location.pathname === item.to ? "active" : ""}
              onClick={(e) => {
                e.preventDefault(); // 기본 링크 동작 방지
                handleClick(item); // 클릭 시 데이터 검증 후 페이지 이동
              }}
            >
              <span className="nav-img">
                <img src={item.imgSrc} alt={item.imgAlt} />
              </span>
              {item.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;
