import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TransactionList from "./View/transaction/TransactionList.js";
import Main from "./View/Main/Main.js";
import MonthStatistics from "./Ui/MonthStatistics.js";
import WeekStatistics from "./Ui/WeekStatistics.js";
import SideNav from "./Components/SideNav/SideNav.js";
import Header from "./Components/Header/Header.js";
import BudgetModification from "./Components/BudgetModification/BudgetModification.js";
import BudgetPage from "./Components/BudgetPage/BudgetPage.js";
import Login from "../src/Components/Login/Login.jsx";
import Signup from "../src/Components/Login/Signup.jsx";
import Forgotpassword from "../src/Components/Login/ForgotPassword.jsx";
import { call } from "./Components/service/ApiService.js";

export const CategoryContext = React.createContext();
export const TransactionListContext = React.createContext();
function App() {
  // DB에서 카테고리 종류 가져오기
  const [categoryList, setCategoryList] = useState([]);
  const getCategory = async () => {
    call("/category", "GET", null)
      .then((response) => {
        if (response) {
          setCategoryList(response.data);
        } else {
          throw new Error("응답 구조가 잘못되었습니다");
        }
      })
      .catch((error) => {
        console.log("카테고리 API Call 에러 :::  ", error);
      });
  };

  // DB에서 지출/수입 내역 가져오기(후에 사용자 id 반영해서 가져오기)
  const [transactionList, setTransactionList] = useState([]);
  const getTransactionList = async () => {
    call("/transactions", "GET", null)
      .then((response) => {
        if (response) {
          console.log(response.data);
          setTransactionList(response.data);
        } else {
          throw new Error("응답 구조가 잘못되었습니다");
        }
      })
      .catch((error) => {
        console.log("지출/수입 내역 API Call 에러 :::  ", error);
      });
  };
  useEffect(() => {
    getCategory();
    getTransactionList();
  }, []);

  return (
    <CategoryContext.Provider value={categoryList}>
      <TransactionListContext.Provider
        value={{ transactionList, getTransactionList }}
      >
        <BrowserRouter>
          <Header />
          <SideNav />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/transactionList" element={<TransactionList />} />
            <Route path="/monthly-report" element={<MonthStatistics />} />
            <Route path="/weekly-report" element={<WeekStatistics />} />
            <Route
              path="/budgetmodification"
              element={<BudgetModification />}
            />
            <Route path="/budgetpage" element={<BudgetPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpw" element={<Forgotpassword />} />
          </Routes>
        </BrowserRouter>
      </TransactionListContext.Provider>
    </CategoryContext.Provider>
  );
}

export default App;
