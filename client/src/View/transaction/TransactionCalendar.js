import React, { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import {
  TransactionListContext,
  CategoryContext,
  UserIdContext,
} from "../../App";
import { formatMonth, formatPrice } from "../../Utils/Utils";
import {
  CalendarDetailModal,
  AddDataModal,
} from "../../Components/Transaction/Modal";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import "./Transaction.css";
import "./TransactionCalendar.css";
const TransactionCalendar = () => {
  const { transactionList, getTransactionList } = useContext(
    TransactionListContext
  );
  const categoryList = useContext(CategoryContext);
  const userId = useContext(UserIdContext);
  const [value, onChange] = useState(new Date());
  const [activeTab, setActiveTab] = useState("all");
  const [filteredTransactionMap, setFilteredTransactionMap] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filterDataLength, setFilterDataLength] = useState(0);
  const [dataForSelectedDate, setDataForSelectedDate] = useState([]);
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [incomeCategory, setIncomeCategory] = useState([]);
  const [assetsCategory, setAssetsCategory] = useState([]);
  const [selectedDate, setSelectedDate] = useState({});
  const [calendarDate, setCalendarDate] = useState(new Date());

  const handleDateClick = (date) => {
    console.log("abcdefg");
    setSelectedDate(formatMonth(date));
    setCalendarDate(date);
    const transactionsArray = Object.values(filteredTransactionMap).flat(); // 객체의 값을 배열로 변환
    const filteredData = transactionsArray.filter(
      (list) =>
        new Date(list.transactionDate).toDateString() === date.toDateString()
    );
    if (filteredData.length > 0) {
      setFilterDataLength(filteredData.length);
      setDataForSelectedDate(filteredData);
      setIsModalOpen(true);
    } else {
      setAddModalOpen(true);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  // 전체 내역의 갯수
  const countTotal = transactionList.length;
  // 전체 지출의 갯수
  const countExpense = transactionList.filter(
    (item) => item.incomeType === "expense"
  ).length;
  // 전체 수입의 갯수
  const countIncome = transactionList.filter(
    (item) => item.incomeType === "income"
  ).length;
  // 'expense'의 총 합계 계산
  const totalExpense = transactionList
    .filter((item) => item.incomeType === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  // 'income'의 총 합계 계산
  const totalIncome = transactionList
    .filter((item) => item.incomeType === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  // 전체 amount의 합계 계산
  const totalAmount = transactionList.reduce((total, item) => {
    // 'expense'일 경우 amount를 음수로 변환하고, 'income'일 경우 양수로 유지
    const adjustedAmount =
      item.incomeType === "expense" ? -item.amount : item.amount;
    return total + adjustedAmount;
  }, 0);

  // 날짜별 지출,수입을 매핑하는 객체 생성
  const createTransactionMap = (transactions) => {
    return transactions.reduce((map, list) => {
      const date = new Date(list.transactionDate).toDateString();
      if (!map[date]) {
        map[date] = [];
      }
      map[date].push(list);
      return map;
    }, {});
  };
  useEffect(() => {
    let filteredTransactions;
    if (activeTab === "income") {
      filteredTransactions = transactionList.filter(
        (item) => item.incomeType === "income"
      );
    } else if (activeTab === "expense") {
      filteredTransactions = transactionList.filter(
        (item) => item.incomeType === "expense"
      );
    } else {
      filteredTransactions = transactionList;
    }
    setFilteredTransactionMap(createTransactionMap(filteredTransactions));
    console.log("filteredTransactions", filteredTransactions);
  }, [activeTab, transactionList]);
  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      const expense = categoryList.filter(
        (category) => category.categoryType === "expense"
      );
      const income = categoryList.filter(
        (category) => category.categoryType === "income"
      );
      const assets = categoryList.filter(
        (category) => category.categoryType === "assets"
      );

      setExpenseCategory(expense);
      setIncomeCategory(income);
      setAssetsCategory(assets);
    }
  }, [categoryList]);

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    const startDate = new Date(
      activeStartDate.getFullYear(),
      activeStartDate.getMonth(),
      1
    );
    const endDate = new Date(
      activeStartDate.getFullYear(),
      activeStartDate.getMonth() + 1,
      0
    );

    // 이전 달의 마지막 주와 다음 달의 첫 주를 포함한 범위로 조정
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(startDate.getDate() - startDate.getDay()); // 해당 주의 첫 번째 날 (일요일)

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // 해당 주의 마지막 날 (토요일)
    const item = { startDate: adjustedStartDate, endDate: adjustedEndDate };
    setSelectedDate(item);
    getTransactionList(item, userId);
  };

  const tileContent = ({ date, view }) => {
    const dateString = date.toDateString();
    if (view === "month") {
      return (
        <div>
          {dateString === new Date().toDateString() && (
            <div className="today-label">오늘</div>
          )}
          {filteredTransactionMap[dateString] && (
            <div className="transaction-amounts">
              {filteredTransactionMap[dateString].map((transaction, index) => {
                return (
                  <div
                    key={index}
                    className={`transaction-amount ${transaction.incomeType}`}
                  >
                    {transaction.incomeType === "expense" ? "-" : "+"}
                    {transaction.amount.toLocaleString()} &nbsp;
                    {transaction.description}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="transcation">
      <div className="table-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => handleTabClick("all")}
          >
            전체 ({countTotal})<br />
            <span
              className={`${totalAmount < 0 ? "tab_expense" : "tab_income"}`}
            >
              {formatPrice(totalAmount)} 원
            </span>
          </button>
          <button
            className={`tab ${activeTab === "income" ? "active" : ""}`}
            onClick={() => handleTabClick("income")}
          >
            수입 ({countIncome})<br />
            <span className="tab_income">{formatPrice(totalIncome)} 원</span>
          </button>
          <button
            className={`tab ${activeTab === "expense" ? "active" : ""}`}
            onClick={() => handleTabClick("expense")}
          >
            지출 ({countExpense})
            <span className="tab_expense">-{formatPrice(totalExpense)} 원</span>
          </button>
        </div>
      </div>
      <Calendar
        onChange={onChange}
        value={value}
        formatDay={(locale, date) =>
          date.toLocaleString("en", { day: "numeric" })
        }
        tileContent={tileContent}
        onActiveStartDateChange={handleActiveStartDateChange}
        onClickDay={handleDateClick}
      />{" "}
      {/* 날짜를 클릭할 때마다 value가 해당 날짜로 변경된다 onActiveStartDateChange={handleActiveStartDateChange} // 날짜 범위 변경 이벤트 핸들러 추가*/}
      {isModalOpen && filterDataLength > 0 ? (
        <CalendarDetailModal
          data={dataForSelectedDate}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          calendarDate={calendarDate}
        />
      ) : addModalOpen ? (
        <AddDataModal
          setAddModalOpen={setAddModalOpen}
          expenseCategory={expenseCategory}
          incomeCategory={incomeCategory}
          assetsCategory={assetsCategory}
          selectedDate={selectedDate}
          booleanCalendar="T"
          calendarDate={calendarDate}
        />
      ) : null}
    </div>
  );
};
export default TransactionCalendar;
