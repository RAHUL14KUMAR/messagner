import { Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";
import Home from "./Home";

const Views = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
    
      <Route path="/" element={<Home/>} />
    
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default Views;