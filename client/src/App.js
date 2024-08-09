import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TransactionList from "./View/transaction/TransactionList.js";
import Main from "./View/Main/Main.js";
import MainNone from "./View/Main/MainNone.js";
import MonthStatistics from "./Ui/MonthStatistics.js";
import WeekStatistics from "./Ui/WeekStatistics.js";
import Header from "./Components/Header/Header.js";
import SideNav from "./Components/SideNav/SideNav.js";
import BudgetModification from "./Components/BudgetModification/BudgetModification.js";
import BudgetPage from "./Components/BudgetPage/BudgetPage.js";
import Login from "../src/Components/Login/Login.jsx";
import Signup from "../src/Components/Login/Signup.jsx";
import Forgotpassword from "../src/Components/Login/ForgotPassword.jsx";
import { call } from "./Components/service/ApiService.js";
import { formatMonth } from "./Utils/Utils.js";
import TransactionCalendar from "./View/transaction/TransactionCalendar.js";
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
  const [originalList, setOriginalList] = useState([]);
  const getTransactionList = async (item = formatMonth(new Date())) => {
    call("/transactions/list", "POST", item)
      .then((response) => {
        if (response) {
          console.log(response.data);
          setTransactionList(response.data);
          setOriginalList(response.data);
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
          <Routes>
            <Route
              path="/main"
              element={
                <Layout>
                  <Main />
                </Layout>
              }
            />
            <Route
              path="/"
              element={
                <LayoutWithoutSideNav>
                  <MainNone />
                </LayoutWithoutSideNav>
              }
            />
            <Route
              path="/transactionList"
              element={
                <Layout>
                  <TransactionList
                    setTransactionList={setTransactionList}
                    originalList={originalList}
                  />
                </Layout>
              }
            />
            <Route
              path="/calendar"
              element={
                <Layout>
                  <TransactionCalendar />
                </Layout>
              }
            />
            <Route
              path="/monthly-report"
              element={
                <Layout>
                  <MonthStatistics />
                </Layout>
              }
            />
            <Route
              path="/weekly-report"
              element={
                <Layout>
                  <WeekStatistics />
                </Layout>
              }
            />
            <Route
              path="/budgetmodification"
              element={
                <Layout>
                  <BudgetModification />
                </Layout>
              }
            />
            <Route
              path="/budgetpage"
              element={
                <Layout>
                  <BudgetPage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <LayoutWithoutSideNav>
                  <Login />
                </LayoutWithoutSideNav>
              }
            />
            <Route
              path="/signup"
              element={
                <LayoutWithoutSideNav>
                  <Signup />
                </LayoutWithoutSideNav>
              }
            />
            <Route
              path="/forgotpw"
              element={
                <Layout>
                  <Forgotpassword />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </TransactionListContext.Provider>
    </CategoryContext.Provider>
  );
}

const Layout = ({ children }) => (
  <div>
    <SideNav />
    {children}
  </div>
);

const LayoutWithoutSideNav = ({ children }) => <div>{children}</div>;

export default App;
