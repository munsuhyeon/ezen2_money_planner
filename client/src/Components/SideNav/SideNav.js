import React from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {TransactionListContext} from "../../App";
import "./SideNav.css";
import {formatMonth} from "../../Utils/Utils"
const SideNav = () => {
  const {getTransactionList} = useContext(TransactionListContext);
  const navigate = useNavigate();
  const location = useLocation();
  const item = formatMonth(new Date());
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
      onClick: () => getTransactionList(item),
    },
    {
      to: "/calendar",
      imgSrc: "/assets/sideNav/date-svgrepo-com.svg",
      imgAlt: "달력아이콘",
      text: "달력",
      onClick: () => getTransactionList(item),
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

  const handleClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    navigate(item.to);
  };

  return (
    <nav className="Side_Nav">
      <ul>
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.to}
              className={location.pathname === item.to ? "active" : ""}
              onClick={() => handleClick(item)}
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
