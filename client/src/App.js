import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionList from "./View/transcation/TransactionList";
import Main from "./View/Main/Main.js";
import MonthStatistics from "./Ui/MonthStatistics.js";
import WeakStatistics from "./Ui/WeakStatistics.js";
import SideNav from "./Components/SideNav/SideNav.js";
import Header from "./Components/Header/Header.js";
import BudgetModification from "./Components/BudgetModification/BudgetModification.js";
import BudgetPage from "./Components/BudgetPage/BudgetPage.js";
import Login from "../src/Components/Login/Login.jsx";
import Signup from "../src/Components/Login/Signup.jsx";
import Forgotpassword from "../src/Components/Login/ForgotPassword.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <SideNav />
        <Routes>
          {/*<Route path="/" element={}/>*/}
          <Route path="/" element={<Main />} />
          <Route path="/transcationList" element={<TransactionList />} />
          <Route path="/monthly-report" element={<MonthStatistics />} />
          <Route path="/weekly-report" element={<WeakStatistics />} />
          <Route path="/budgetmodification" element={<BudgetModification />} />
          <Route path="/budgetpage" element={<BudgetPage />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/forgotpw" element={<Forgotpassword/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
