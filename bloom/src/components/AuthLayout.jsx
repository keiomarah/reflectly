import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/reflectly-logo.png";

export function AuthLayout({ children }) {
  return (
    <>
      <div className="login-page">
        <div className="login-form">
          <div className="left-panel">{children}</div>
          <div className="right-panel">
            <div className="login-headline">
              <h2>Get a feel for what's going on.</h2>
              <p>
                A safe space to reflect on how you are feeling without
                judgement.
              </p>
            </div>
            <div className="circle-1 circle"></div>
            <div className="circle-2 circle"></div>
            <div className="circle-3 circle"></div>
            <div className="circle-4 circle"></div>
            <div className="circle-5 circle"></div>
            <div className="circle-6 circle"></div>
          </div>
        </div>
      </div>
    </>
  );
}
