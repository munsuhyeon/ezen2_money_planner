import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionList from './View/transcation/TransactionList';
function App() {
  return (
      <BrowserRouter>
        <Routes>
        <Route path="/transcationList" element={<TransactionList />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
