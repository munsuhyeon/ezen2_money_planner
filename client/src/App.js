import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionList from "./View/transcation/TransactionList";
import Main from "./View/Main/Main.js";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/transcationList" element={<TransactionList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
