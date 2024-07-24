import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionList from "./View/transcation/TransactionList";
import Main from "./View/Main/Main.js";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/*<Route path="/" element={}/>*/}
          <Route path="/" element={<Main />} />
          <Route path="/transcationList" element={<TransactionList />} />
          <Route path="/monthstatistics" element={<MonthStatistics />} />
          <Route path="/weakstatistics" element={<WeakStatistics />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
