import { useState } from "react";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./Ultis/PrivateRoute";
import LoginPage from "./Pages/LoginPage";
import MainPage from "./Pages/MainPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<MainPage />} />
      </Route>
    </Routes>
  );
}

export default App;
