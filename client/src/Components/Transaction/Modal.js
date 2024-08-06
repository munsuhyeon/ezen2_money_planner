import React, { useState, useRef, useEffect, useContext } from "react";
import "./Modal.css";
import Checkbox from "../../Ui/Checkbox";
import { formatDate, formatTime } from "../../Utils/Utils";
import { call } from "../service/ApiService";
import { TransactionListContext } from "../../App";

export const AddDataModal = ({
  setAddModalOpen,
  expenseCategory,
  incomeCategory,
  assetsCategory,
}) => {
  const { getTransactionList } = useContext(TransactionListContext);
  const closeModal = () => {
    setAddModalOpen(false);
  };
  const handlePopupTab = (tab) => {
    setPopupTab(tab);
  };
  const [popupTab, setPopupTab] = useState("expense");
  const [nowDate, setNowDate] = useState(formatDate(new Date()));
  const handleDateChange = (e) => {
    setNowDate(e.target.value);
  };
  const [nowTime, setNowTime] = useState(formatTime(new Date()));
  const [Selected, setSelected] = useState(0);
  const [incomeType, setIncomeType] = useState("expense");
  useEffect(() => {
    setIncomeType(popupTab === "income" ? "income" : "expense");
  }, [popupTab]);

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };
  const handleTimeChange = (e) => {
    setNowTime(e.target.value);
  };
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const amountRef = useRef(null);
  const [selectedAsset, setSelectedAsset] = useState('card');
  const categoryRef = useRef(null);
  const assetRef = useRef(null);
  const installmentRef = useRef(null);
  const descriptionRef = useRef(null);
  const userId = "test123";
  // assetRef의 값이 변경될 때 상태 업데이트
  useEffect(() => {
    if (assetRef.current) {
      setSelectedAsset(assetRef.current.value);
    }
  }, [assetRef.current?.value]);
  const handleAssetChange = () => {
    if (assetRef.current) {
      setSelectedAsset(assetRef.current.value);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryElement = categoryRef.current;
    const selectedOption =
      categoryRef.current.options[categoryElement.selectedIndex];
    const selectedCategoryName =
      selectedOption.getAttribute("data-category-name");

    const formData = {
      amount: amountRef.current.value,
      categoryId: categoryRef.current.value,
      paymentType: assetRef.current.value,
      incomeType: incomeType,
      installment:
        popupTab === "expense" && installmentRef.current
          ? installmentRef.current.value
          : "",
      description: descriptionRef.current.value,
      userId: userId,
      categoryName: selectedCategoryName,
      transactionDate: `${dateRef.current.value}T${timeRef.current.value}:00`,
    };
    console.log("formData :", formData);
    if (amountRef.current.value === "") {
      alert("금액을 입력해주세요.");
      return;
    } else if (descriptionRef.current.value === "") {
      alert("내용을 입력해주세요.");
      return;
    } else {
      call("/transactions", "POST", formData)
        .then((response) => {
          console.log(response);
          setAddModalOpen(false);
          getTransactionList();
        })
        .catch((error) => console.error("저장 실패", error));
    }
  };
    return(
        <div className="popup-menu" id="popup-menu">
                <div className="pop-menu-head">
                    <h1 className="pop-menu-title">입력</h1>
                    <p id="closeButton" className="close-button" onClick={closeModal}><img src={process.env.PUBLIC_URL + `assets/close-svgrepo-com.svg`} alt="close"/></p>
                </div>
                <form onSubmit={handleSubmit} className={`input-form ${popupTab === 'income' ? 'income' : 'expense'}`}>
                    <div className="tab-buttons">
                        <button type="button" className={`pop-up-tab incomeTab ${popupTab === 'income' ? 'active' : ''}`} onClick={()=>{handlePopupTab('income')}}>수입</button>
                        <button type="button" className={`pop-up-tab expenseTab ${popupTab === 'expense' ? 'active' : ''}`} onClick={()=>{handlePopupTab('expense')}}>지출</button>
                    </div>
                    <div className="input-wrap">
                        <div className="date-time">
                            <div>
                                <label htmlFor="date">날짜</label>
                                <input type="date" id="date" value={nowDate} onChange={handleDateChange} ref={dateRef}/>
                            </div>
                            <div>
                                <label htmlFor="time">시간</label>
                                <input type="time" id="time" value={nowTime} onChange={handleTimeChange} ref={timeRef}/>
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="amount">금액</label>
                            <input type="number" id="amount"  ref={amountRef}/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="category">분류</label>
                            <select id="category"  className="custom-select" ref={categoryRef}>
                                {popupTab === 'expense' &&
                                    expenseCategory.map((item) => (
                                        <option key={item.categoryId} value={item.categoryId} data-category-name={item.categoryName}>{item.categoryName}</option>
                                    ))
                                }
                                {popupTab === 'income' &&
                                    incomeCategory.map((item) => (
                                        <option key={item.categoryId} value={item.categoryId} data-category-name={item.categoryName}>{item.categoryName}</option>
                                    ))
                                }
                            </select>
                            <img src={process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`} alt="Arrow Down" className="custom-select-arrow"/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="asset">자산</label>
                            <select id="asset"  ref={assetRef} onChange={handleAssetChange}>
                                {assetsCategory.map((item) => (
                                    <option key={item.categoryId} value={item.categoryName == '카드' ? 'card' : 'cash'}>{item.categoryName}</option>
                                ))}
                            </select>
                            <img src={process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`} alt="Arrow Down" className="custom-select-arrow"/>
                        </div>
                        {popupTab === 'expense' && (
                        <div className="input-group" id="repeat-wrap">
                            <label htmlFor="repeat">할부</label>
                              {selectedAsset === 'card' ? (
                                <select id="repeat" ref={installmentRef} onChange={handleSelect} value={Selected}>
                                  <option value={0}>일시불</option>
                                  <option value={1}>1개월</option>
                                  <option value={2}>2개월</option>
                                  <option value={3}>3개월</option>
                                  <option value={4}>4개월</option>
                                  <option value={5}>5개월</option>
                                  <option value={6}>6개월</option>
                                  <option value={7}>7개월</option>
                                  <option value={8}>8개월</option>
                                  <option value={9}>9개월</option>
                                  <option value={10}>10개월</option>
                                  <option value={11}>11개월</option>
                                  <option value={12}>12개월</option>
                                </select>
                              ) : (
                                <select id="repeat" ref={installmentRef} onChange={handleSelect} value={Selected}>
                                  <option value={0}>일시불</option>
                                </select>
                              )}
                            
                            <img src={process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`} alt="Arrow Down" className="custom-select-arrow"/>
                        </div>
                        )}
                        <div className="input-group">
                            <label htmlFor="description">내용</label>
                            <input type="text" id="description" ref={descriptionRef}/>
                        </div>
                        <div className="button-group">
                            <button type="submit" className={`save-button ${popupTab === 'expense' ? 'expense-active' : 'income-active'}`} >저장</button>
                        </div>
                    </div>
                </form>
            </div>
    )
}

export const SearchModal = ({setSearchModalOpen,expenseCategory,incomeCategory,assetsCategory,installmentCategory,setTransactionList,originalList}) => {
  const closeModal = () => {
    setSearchModalOpen(false);
  };
  const [checkedBoxes, setCheckedBoxes] = useState({
    expense: Array(expenseCategory.length).fill(false),
    income: Array(incomeCategory.length).fill(false),
    assets: Array(assetsCategory.length).fill(false),
    installment: Array(installmentCategory.length).fill(false),
  });

  const toggleCheckBox = (categoryType, index) => {
    setCheckedBoxes((prev) => ({
      ...prev,
      [categoryType]: prev[categoryType].map((checked, i) =>
        i === index ? !checked : checked
      ),
    }));
  };

  const renderCheckboxList = (categoryType, categories) => (
    <ul>
      {categories.map((item, index) => (
        <li className="categoryList" key={item.categoryId}>
          <Checkbox
            id={item.categoryId}
            text={item.categoryName}
            checked={checkedBoxes[categoryType][index]}
            onChange={() => toggleCheckBox(categoryType, index)}
          />
        </li>
      ))}
    </ul>
  );
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = () => {
    let filterList = [];

    if(searchInput !== ""){
       const inputList = originalList.filter((list) => {return list.description.includes(searchInput)})
       filterList = [...filterList, ...inputList]; // inputList를 filterList에 추가
    }

    // 체크박스의 카테고리를 분류별로 나누어 data에 해당 카테고리 유형의 데이터 배열을 저장
    const categories = [
      { type: "expense", data: expenseCategory },
      { type: "income", data: incomeCategory },
      { type: "assets", data: assetsCategory },
      { type: "installment", data: installmentCategory },
    ];
    // flatMap메서드는 categories배열의 각 요소에 대해 콜백 함수를 실행하고,
    // 그 결과를 하나의 배열로 평탄화한다
    // 콜백함수의 매개변수는 구조분해 할당을 통해 type과 data를 받는다
    const allSelectedCategoryIds = categories.flatMap(({ type, data }) =>
      data
        .filter((_, index) => checkedBoxes[type][index]) // 특정 조건을 만족하는 요소만을 반환 '_' : 현재 요소 'index' : 현재 요소의 인덱스  => 사용자가 선택한 체크박스 배열이다. type에 따라 특정 카테고리의 체크박스 배열을 참조하고, 해당 인덱스의 체크박스가 선택되었는지 여부를 확인한다. 예를 들어, type이 'expense'이면 checkedBoxes['expense'] 배열의 해당 인덱스 값이 true인 경우 해당 요소가 필터링된다
        .map(item => item.categoryId) // filter메서드를 통과한 요소들에 대해 map메서드를 사용하여 각 요소의 categoryId를 추출한다. 이 값들은 새로운 배열로 반환된다.
    );
    if(allSelectedCategoryIds.length !== 0 && !allSelectedCategoryIds.includes(25) && !allSelectedCategoryIds.includes(26) && !allSelectedCategoryIds.includes(27)){
      // 이번달 데이터에서 선택한 체크박스의 카테고리아이디가 해당된 데이터 새로운 배열에 담기
      const checkboxFilterList = originalList.filter((list) =>
        allSelectedCategoryIds.includes(list.categoryId)
      );
    filterList = [...filterList, ...checkboxFilterList]; // checkboxFilterList를 filterList에 추가
    }else if(allSelectedCategoryIds.length !== 0 && allSelectedCategoryIds.includes(25)){
      const checkboxFilterList = originalList.filter((list) =>
        allSelectedCategoryIds.includes(list.categoryId)
      );
      const assestFilterList = originalList.filter((list)=>list.paymentType === "card")
      filterList = [...filterList, ...checkboxFilterList, ...assestFilterList];
    }else if(allSelectedCategoryIds.length !== 0 && allSelectedCategoryIds.includes(26)){
      const checkboxFilterList = originalList.filter((list) =>
        allSelectedCategoryIds.includes(list.categoryId)
      );
      const assestFilterList = originalList.filter((list)=>list.paymentType === "cash")
      filterList = [...filterList, ...checkboxFilterList, ...assestFilterList];
    }else if(allSelectedCategoryIds.length !== 0 && allSelectedCategoryIds.includes(27)){
      console.log("할부")
      const checkboxFilterList = originalList.filter((list) =>
        allSelectedCategoryIds.includes(list.categoryId)
      );
      const installmentsFilterList = originalList.filter((list)=>list.installment !== 0);
      filterList = [...filterList, ...checkboxFilterList, ...installmentsFilterList];
    }

    setSearchModalOpen(false); // 모달창 닫기
    setSearchInput("") // 검색어 초기화
    setTransactionList(filterList); // TransactionList.js에 표시할 리스트 업데이트
  }
  return (
    <div className="popup-menu" id="search-menu">
      <div className="pop-menu-head">
        <h1 className="pop-menu-title">검색</h1>
        <p id="closeButton" className="close-button" onClick={closeModal}>
          <span>
            <img
              src={process.env.PUBLIC_URL + `assets/close-svgrepo-com.svg`}
              alt="close"
            />
          </span>
        </p>
      </div>
      <div className="check-wrap">
        <div className="search-wrap">
          <input
            type="text"
            className="searchForm"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {/*<div className="searchImg" >
            <img
              src={process.env.PUBLIC_URL + `assets/search-svgrepo-com.svg`}
            />
          </div>*/}
        </div>

        <div className="expense-checkbox">
          <p className="filter-title">카테고리(지출)</p>
          {renderCheckboxList("expense", expenseCategory)}
        </div>

        <div className="income-checkbox">
          <p className="filter-title">카테고리(수입)</p>
          {renderCheckboxList("income", incomeCategory)}
        </div>

        <div className="property-checkbox">
          <p className="filter-title">자산</p>
          {renderCheckboxList("assets", assetsCategory)}
        </div>

        <div className="installment-checkbox">
          <p className="filter-title">할부</p>
          {renderCheckboxList("installment", installmentCategory)}
        </div>
      </div>

      <div className="button-group" onClick={handleSearch}>
          <button className="search-button">검색</button>
      </div>
    </div>
  );
};

export const DataDetailModal = ({
  setDataDetailModalOpen,
  expenseCategory,
  incomeCategory,
  assetsCategory,
  filterData,
}) => {
  const closeModal = () => {
    setDataDetailModalOpen(false);
  };
  const { getTransactionList } = useContext(TransactionListContext);
  const [popupTab, setPopupTab] = useState(filterData.incomeType);
  const [amount, setAmount] = useState(filterData.amount);
  const [categoryId, setCategoryId] = useState(filterData.categoryId);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState(filterData.description);
  const [incomeType, setIncomeType] = useState(filterData.incomeType);
  const [paymentType, setPaymentType] = useState(filterData.paymentType);
  const [transactionId, setTransactionId] = useState(filterData.transactionId);
  const [filterDate, setFilterDate] = useState(
    formatDate(filterData.transactionDate)
  );
  const [filterTime, setFilterTime] = useState(
    formatTime(filterData.transactionDate)
  );
  const [installment, setInstallment] = useState(filterData.installment);
  const userId = "test123";
  const categoryIdRef = useRef(filterData.categoryId);
  const assetRef = useRef(paymentType);
  const handlePopupTab = (tab) => {
    setPopupTab(tab);
    setIncomeType(tab);
    if (tab === "income") {
      setInstallment(0);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = {
      transactionId: transactionId,
      amount: amount,
      categoryId: categoryId,
      paymentType: paymentType,
      incomeType: incomeType,
      installment: installment,
      description: description,
      userId: userId,
      categoryName: categoryName,
      transactionDate: `${filterDate}T${filterTime}:00`,
    };
    console.log("formData :", formData);
    if (amount === "") {
      alert("금액을 입력해주세요.");
      return;
    } else if (description === "") {
      alert("내용을 입력해주세요.");
      return;
    } else {
      call("/transactions", "PUT", formData)
        .then((response) => {
          console.log(response);
          setDataDetailModalOpen(false);
          getTransactionList();
        })
        .catch((error) => console.error("수정 실패", error));
    }
  };

  return (
    <div className="popup-menu" id="popup-menu">
      <div className="pop-menu-head">
        <h1 className="pop-menu-title">입력</h1>
        <p id="closeButton" className="close-button" onClick={closeModal}>
          <img
            src={process.env.PUBLIC_URL + `assets/close-svgrepo-com.svg`}
            alt="close"
          />
        </p>
      </div>
      <form
        onSubmit={handleUpdate}
        className={`input-form ${popupTab === "income" ? "income" : "expense"}`}
      >
        <div className="tab-buttons">
          <button
            type="button"
            className={`pop-up-tab incomeTab ${
              popupTab === "income" ? "active" : ""
            }`}
            onClick={() => {
              handlePopupTab("income");
            }}
          >
            수입
          </button>
          <button
            type="button"
            className={`pop-up-tab expenseTab ${
              popupTab === "expense" ? "active" : ""
            }`}
            onClick={() => {
              handlePopupTab("expense");
            }}
          >
            지출
          </button>
        </div>
        <div className="input-wrap">
          <div className="date-time">
            <div>
              <label htmlFor="date">날짜</label>
              <input
                type="date"
                id="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="time">시간</label>
              <input
                type="time"
                id="time"
                value={filterTime}
                onChange={(e) => {
                  setFilterTime(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="amount">금액</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <label htmlFor="category">분류</label>
            <select
              id="category"
              className="custom-select"
              ref={categoryIdRef}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                const selectedOption = e.target.options[e.target.selectedIndex];
                setCategoryName(
                  selectedOption.getAttribute("data-category-name")
                );
              }}
            >
              {popupTab === "expense" &&
                expenseCategory.map((item) => (
                  <option
                    key={item.categoryId}
                    value={item.categoryId}
                    data-category-name={item.categoryName}
                  >
                    {item.categoryName}
                  </option>
                ))}
              {popupTab === "income" &&
                incomeCategory.map((item) => (
                  <option
                    key={item.categoryId}
                    value={item.categoryId}
                    data-category-name={item.categoryName}
                  >
                    {item.categoryName}
                  </option>
                ))}
            </select>
            <img
              src={
                process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`
              }
              alt="Arrow Down"
              className="custom-select-arrow"
            />
          </div>
          <div className="input-group">
            <label htmlFor="asset">자산</label>
            <select
              id="asset"
              value={paymentType}
              ref={assetRef}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              {assetsCategory.map((item) => (
                <option
                  key={item.categoryId}
                  value={item.categoryName === "카드" ? "card" : "cash"}
                >
                  {item.categoryName}
                </option>
              ))}
            </select>
            <img
              src={
                process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`
              }
              alt="Arrow Down"
              className="custom-select-arrow"
            />
          </div>
          {popupTab === "expense" && (
            <div className="input-group" id="repeat-wrap">
              <label htmlFor="repeat">할부</label>
              <select
                id="repeat"
                onChange={(e) => setInstallment(e.target.value)}
                value={installment}
              >
                <option value={0}>일시불</option>
                <option value={1}>1개월</option>
                <option value={2}>2개월</option>
                <option value={3}>3개월</option>
                <option value={4}>4개월</option>
                <option value={5}>5개월</option>
                <option value={6}>6개월</option>
                <option value={7}>7개월</option>
                <option value={8}>8개월</option>
                <option value={9}>9개월</option>
                <option value={10}>10개월</option>
                <option value={11}>11개월</option>
                <option value={12}>12개월</option>
              </select>
              <img
                src={
                  process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`
                }
                alt="Arrow Down"
                className="custom-select-arrow"
              />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="description">내용</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div className="button-group">
            <button
              type="submit"
              className={`save-button ${
                popupTab === "expense" ? "expense-active" : "income-active"
              }`}
            >
              수정
            </button>
            <button
              type="button"
              className={`ok-button ${
                popupTab === "expense" ? "expense-active" : "income-active"
              }`}
              onClick={closeModal}
            >
              확인
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
