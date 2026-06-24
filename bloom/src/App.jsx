import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { Account } from "./pages/account";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { HomeDashboard } from "./pages/HomeDashboard";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <Router>
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            padding: "16px 20px",
            borderRadius: "10px",
            fontSize: "14px",
            margin: "14px",
          },
          success: {
            iconTheme: {
              primary: "#124106",
              secondary: "#c4ffb4",
            },
            style: { backgroundColor: "#c4ffb4", color: "#124106" },
            duration: 3000,
          },
          error: {
            iconTheme: {
              primary: "#690505",
              secondary: "#ffb4b4",
            },
            style: { backgroundColor: "#ffb4b4", color: "#690505" },
            duration: 3000,
          },
        }}
      />
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/homedashboard" element={<HomeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
