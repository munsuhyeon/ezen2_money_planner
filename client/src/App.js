import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionList from "./View/transcation/TransactionList";
import Main from "./View/Main/Main.js";
import MonthStatistics from "./Ui/MonthStatistics.js";
import WeakStatistics from "./Ui/WeakStatistics.js";
import SideNav from "./Components/SideNav/SideNav.js";
import Header from "./Components/Header/Header.js";
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
