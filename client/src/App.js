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
import BudgetModification from "./Components/BudgetModificationModal/BudgetModificationModal.js";
import BudgetPage from "./Components/BudgetPage/BudgetPage.js";
import Login from "../src/Components/Login/Login.jsx";
import Signup from "../src/Components/Login/Signup.jsx";
import Forgotpassword from "../src/Components/Login/ForgotPassword.jsx";
import { call } from "./Components/service/ApiService.js";
import { formatMonth } from "./Utils/Utils.js";
import TransactionCalendar from "./View/transaction/TransactionCalendar.js";
import KakaoLogin from "./Components/Login/KakaoLogin.jsx";
import KakaoToken from "./Components/Login/KakaoToken.jsx";
export const CategoryContext = React.createContext();
export const TransactionListContext = React.createContext();
export const UserIdContext = React.createContext();
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

  // 로컬스토리지에서 userId 가져오기
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // DB에서 지출/수입 내역 가져오기(후에 사용자 id 반영해서 가져오기)
  const [transactionList, setTransactionList] = useState([]);
  const [originalList, setOriginalList] = useState([]);

  const getTransactionList = async (item = formatMonth(new Date()), userId) => {
    const storageData = localStorage.getItem("user");
    let requestData = {};
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      const userId = parsedData.userid;
      requestData = { ...item, userId };
    }
    //console.log("여기인가?    ", userId)
    call("/transactions/list", "POST", requestData)
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
    console.log("REACT_APP_backend_HOST   :::   ",process.env.REACT_APP_backend_HOST)
    const storageData = localStorage.getItem("user");
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      const userId = parsedData.userid;
      const username = parsedData.username;
      setUserId(userId);
      setUsername(username);
      setLoggedIn(true);
      console.log("로그인한 아이디::::::", userId);
      if (userId) {
        getCategory();
        const date = formatMonth(new Date());
        getTransactionList(date, userId);
      }
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <CategoryContext.Provider value={categoryList}>
      <TransactionListContext.Provider
        value={{ transactionList, getTransactionList }}
      >
        <UserIdContext.Provider value={userId}>
          <BrowserRouter>
            <Header setTransactionList={setTransactionList} />
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
              <Route path="/user/kakao" element={<KakaoLogin />} />
              <Route path="/user" element={<KakaoToken />} />
            </Routes>
          </BrowserRouter>
        </UserIdContext.Provider>
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
