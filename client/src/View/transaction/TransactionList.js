import React, { useState, useEffect, useContext, useRef } from "react";
import "./Transaction.css";
import {
  AddDataModal,
  SearchModal,
  DataDetailModal,
} from "../../Components/Transaction/Modal";
import { call } from "../../Components/service/ApiService";
import {
  CategoryContext,
  TransactionListContext,
  UserIdContext,
} from "../../App";
import {
  convertToCustomDateFormat,
  formatPrice,
  formatMonth,
} from "../../Utils/Utils";
import Checkbox from "../../Ui/Checkbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
const TransactionList = ({ setTransactionList, originalList }) => {
  const categoryList = useContext(CategoryContext);
  const { transactionList, getTransactionList } = useContext(
    TransactionListContext
  );
  const userId = useContext(UserIdContext);
  useEffect(() => {
    // 화면 재 랜더링하기
    //console.log("TransactionList가 업데이트되었습니다:", transactionList);
  }, [transactionList]);
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

  // 전체 지출의 갯수
  const countExpense = transactionList.filter(
    (item) => item.incomeType === "expense"
  ).length;
  // 전체 내역의 갯수
  const countTotal = transactionList.length;
  // 전체 수입의 갯수
  const countIncome = transactionList.filter(
    (item) => item.incomeType === "income"
  ).length;

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [dataDetailModalOpen, setDataDetailModalOpen] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [incomeCategory, setIncomeCategory] = useState([]);
  const [assetsCategory, setAssetsCategory] = useState([]);
  const [installmentCategory, setInstallmentCategory] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
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
      const installment = categoryList.filter(
        (category) => category.categoryType === "installments"
      );

      setExpenseCategory(expense);
      setIncomeCategory(income);
      setAssetsCategory(assets);
      setInstallmentCategory(installment);
    }
  }, [categoryList]);
  //useEffect(() => {}, [expenseCategory]);
  const showModal = (btn) => {
    if (btn == "addData") {
      setAddModalOpen(true);
    } else if (btn == "search") {
      setSearchModalOpen(true);
    } else if (btn == "detailData") {
      setDataDetailModalOpen(true);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  // 체크박스 상태 관리
  const [isChecked, setIsChecked] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);
  // 개별 체크박스 상태 관리
  const handleCheckboxChange = (event, transactionId) => {
    setIsChecked((prevState) => ({
      ...prevState,
      [transactionId]: event.target.checked,
    }));
  };
  // 전체 체크박스 상태 관리
  const handleAllCheckboxChange = () => {
    const updatedChecked = {};
    const currentTabList = transactionList.filter((item) => {
      if (activeTab === "all") return true;
      return item.incomeType === activeTab;
    });

    currentTabList.forEach((item) => {
      updatedChecked[item.transactionId] = !isAllChecked;
    });

    setIsChecked(updatedChecked);
    setIsAllChecked(!isAllChecked);
  };
  const deleteList = () => {
    const keys = Object.keys(isChecked);
    const formDataArray = keys.map((key) => ({ transactionId: Number(key) }));
    const date = formatMonth(selectedDate);
    const requestBody = {
      transactions: formDataArray,
      startDate: date.startDate,
      endDate: date.endDate,
      userId: userId,
    };
    if(window.confirm("삭제하시겠습니까?")){
      call("/transactions", "DELETE", requestBody)
      .then((response) => {
        //console.log(response)
        if (isAllChecked) {
          setIsAllChecked(false);
        }
        const item = formatMonth(selectedDate);
        getTransactionList(item, userId);
      })
      .catch((error) => console.error("삭제 실패", error));
    }else{
      return;
    }
  };

  const detailData = (id) => {
    const filterItem = transactionList.filter(
      (list) => id === list.transactionId
    );
    //console.log(filterItem)
    setFilterData(filterItem[0]);
    showModal("detailData");
  };
  /* 현재 날짜 선택 */
  const datePickerRef = useRef();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const handleChange = async (date) => {
    setSelectedDate(date);
    const item = formatMonth(date);
    getTransactionList(item, userId);
  };
  // 날짜옆에 아래화살표 클릭해도 달력 펼쳐짐
  const handleImgClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.click();
    }
  };
  const downloadExcel = async () => {
    const date = formatMonth(selectedDate);
    //console.log(date);
    //console.log("유저아이디========",userId);
    const storageData = localStorage.getItem("user");
    const parsedData = JSON.parse(storageData);
    const user = parsedData.userid;
    const baseUrl = process.env.REACT_APP_backend_HOST;
    const api = "/transactions/excel";
    const url = `${baseUrl}${api}`;
    let headers = new Headers({
      "Content-Type": "application/json",
    });
    const requestBody = {
      startDate: date.startDate,
      endDate: date.endDate,
      userId: user,
    };
    let options = {
      headers: headers,
      method: "POST",
      body: JSON.stringify(requestBody),
    };
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${year}년${month}월달 가계부 내역.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        alert("파일이 저장되었습니다");
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("엑셀 저장 API Call 에러 ::: ", error);
    }
  };
  return (
    <div className="transcation" id="transcation">
      <div className="content-header">
        <h2 className="date-button">
          <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            dateFormat="yyyy년 MM월"
            showMonthYearPicker
            locale={ko}
            ref={datePickerRef}
          />
          <img
            src={process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`}
            alt="arrow-down"
            className="arrow-down"
            onClick={handleImgClick}
          />
        </h2>
        <div className="btn-wrap">
          <div
            className="add-data"
            id="add-data"
            onClick={() => {
              showModal("addData");
            }}
          >
            <img
              src={process.env.PUBLIC_URL + `assets/plus-svgrepo-com.svg`}
              alt="plus"
            />
          </div>
          <div
            className="circle-btn"
            id="search-btn"
            onClick={() => {
              showModal("search");
            }}
          >
            <img
              src={process.env.PUBLIC_URL + `assets/search-svgrepo-com.svg`}
              alt="search"
            />
          </div>
          <div className="circle-btn" id="delete-btn" onClick={deleteList}>
            <img
              src={
                process.env.PUBLIC_URL +
                `assets/trash-bin-trash-svgrepo-com.svg`
              }
              alt="trash"
            />
          </div>
          <div className="circle-btn" onClick={downloadExcel}>
            <img
              src={process.env.PUBLIC_URL + `assets/excel2-svgrepo-com.svg`}
              alt="excel"
            />
          </div>
        </div>
      </div>
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
        <div>
          <table className="transcation-table">
            <thead>
              <tr>
                <th>
                  <Checkbox
                    id="checkbox-all"
                    checked={isAllChecked}
                    onChange={(event) => handleAllCheckboxChange(event)}
                  />
                </th>
                <th>날짜</th>
                <th>자산</th>
                <th>분류</th>
                <th>금액</th>
                <th>내용</th>
                <th>할부</th>
              </tr>
            </thead>
            <tbody
              id="all"
              className="tab-content"
              style={{
                display: activeTab === "all" ? "table-row-group" : "none",
              }}
            >
              {transactionList && transactionList.length > 0 ? (
                transactionList.map((item) => (
                  <tr key={item.transactionId}>
                    <td>
                      <Checkbox
                        id={item.transactionId}
                        checked={isChecked[item.transactionId] || false}
                        onChange={(event) =>
                          handleCheckboxChange(event, item.transactionId)
                        }
                      />
                    </td>
                    <td
                      onClick={() => detailData(item.transactionId)}
                      style={{ cursor: "pointer" }}
                    >
                      {convertToCustomDateFormat(item.transactionDate)}
                    </td>
                    <td>{item.paymentType === "card" ? "카드" : "현금"}</td>
                    <td>{item.categoryName}</td>
                    <td
                      className={`${
                        item.incomeType === "expense"
                          ? "tab_expense"
                          : "tab_income"
                      }`}
                    >
                      {item.incomeType === "expense"
                        ? "-" + formatPrice(item.amount)
                        : "+" + formatPrice(item.amount)}
                    </td>
                    <td>{item.description}</td>
                    <td>
                      {item.incomeType === "income"
                        ? ""
                        : item.incomeType === "expense" && item.installment == 0
                        ? "일시불"
                        : item.installment + `개월`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    <div className="no-data-text">데이터가 없습니다.</div>
                  </td>
                </tr>
              )}
            </tbody>
            <tbody
              id="income"
              className="tab-content"
              style={{
                display: activeTab === "income" ? "table-row-group" : "none",
              }}
            >
              {transactionList &&
              transactionList.filter((list) => list.incomeType === "income")
                .length > 0 ? (
                transactionList
                  .filter((list) => list.incomeType === "income")
                  .map((item) => (
                    <tr key={item.transactionId}>
                      <td>
                        <Checkbox
                          id={item.transactionId}
                          checked={isChecked[item.transactionId] || false}
                          onChange={(event) =>
                            handleCheckboxChange(event, item.transactionId)
                          }
                        />
                      </td>
                      <td>{convertToCustomDateFormat(item.transactionDate)}</td>
                      <td>{item.paymentType == "card" ? "카드" : "현금"}</td>
                      <td>{item.categoryName}</td>
                      <td
                        className={`${
                          item.incomeType === "expense"
                            ? "tab_expense"
                            : "tab_income"
                        }`}
                      >
                        {item.incomeType === "expense"
                          ? "-" + formatPrice(item.amount)
                          : "+" + formatPrice(item.amount)}
                      </td>
                      <td>{item.description}</td>
                      <td>
                        {item.incomeType === "income"
                          ? ""
                          : item.incomeType === "expense" &&
                            item.installment == 0
                          ? "일시불"
                          : item.installment + `개월`}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    <div className="no-data-text">데이터가 없습니다.</div>
                  </td>
                </tr>
              )}
            </tbody>
            <tbody
              id="expense"
              className="tab-content"
              style={{
                display: activeTab === "expense" ? "table-row-group" : "none",
              }}
            >
              {transactionList &&
              transactionList.filter((list) => list.incomeType === "expense")
                .length > 0 ? (
                transactionList
                  .filter((list) => list.incomeType === "expense")
                  .map((item) => (
                    <tr key={item.transactionId}>
                      <td>
                        <Checkbox
                          id={item.transactionId}
                          checked={isChecked[item.transactionId] || false}
                          onChange={(event) =>
                            handleCheckboxChange(event, item.transactionId)
                          }
                        />
                      </td>
                      <td>{convertToCustomDateFormat(item.transactionDate)}</td>
                      <td>{item.paymentType == "card" ? "카드" : "현금"}</td>
                      <td>{item.categoryName}</td>
                      <td
                        className={`${
                          item.incomeType === "expense"
                            ? "tab_expense"
                            : "tab_income"
                        }`}
                      >
                        {item.incomeType === "expense"
                          ? "-" + formatPrice(item.amount)
                          : "+" + formatPrice(item.amount)}
                      </td>
                      <td>{item.description}</td>
                      <td>
                        {item.incomeType === "income"
                          ? ""
                          : item.incomeType === "expense" &&
                            item.installment == 0
                          ? "일시불"
                          : item.installment + `개월`}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    <div className="no-data-text">데이터가 없습니다.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addModalOpen && (
        <AddDataModal
          setAddModalOpen={setAddModalOpen}
          expenseCategory={expenseCategory}
          incomeCategory={incomeCategory}
          assetsCategory={assetsCategory}
          selectedDate={selectedDate}
          booleanCalendar="F"
          calendarDate={calendarDate}
        />
      )}

      {searchModalOpen && (
        <SearchModal
          setSearchModalOpen={setSearchModalOpen}
          expenseCategory={expenseCategory}
          originalList={originalList}
          incomeCategory={incomeCategory}
          assetsCategory={assetsCategory}
          installmentCategory={installmentCategory}
          setTransactionList={setTransactionList}
        />
      )}

      {dataDetailModalOpen && (
        <DataDetailModal
          setDataDetailModalOpen={setDataDetailModalOpen}
          expenseCategory={expenseCategory}
          incomeCategory={incomeCategory}
          assetsCategory={assetsCategory}
          filterData={filterData}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};
export default TransactionList;
