import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./SideNav.css";

const SideNav = () => {
  const location = useLocation();

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
    },
    {
      to: "/calendar",
      imgSrc: "/assets/sideNav/date-svgrepo-com.svg",
      imgAlt: "달력아이콘",
      text: "달력",
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
            <Link
              to={item.to}
              className={location.pathname === item.to ? "active" : ""}
            >
              <span className="nav-img">
                <img src={item.imgSrc} alt={item.imgAlt} />
              </span>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;
