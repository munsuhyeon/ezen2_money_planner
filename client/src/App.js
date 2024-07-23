import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/Components/Login/Login.jsx";
import Signup from "../src/Components/Login/Signup.jsx";
import Forgotpassword from "../src/Components/Login/ForgotPassword.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/forgotpw" element={<Forgotpassword/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
