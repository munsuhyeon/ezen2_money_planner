import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MonthStatistics from "./Ui/MonthStatistics.js";
import WeakStatistics from "./Ui/WeakStatistics.js";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/*<Route path="/" element={}/>*/}
          <Route path="/monthstatistics" element={<MonthStatistics />} />
          <Route path="/weakstatistics" element={<WeakStatistics />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
