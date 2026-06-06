import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/reflectly-logo.png";
import axios from "axios";
import { FlashMessage } from "./FlashMessage";

export function AuthLayout({
  flashMessage,
  category,
  setFlashMessage,
  children,
}) {
  return (
    <>
      <div className="login-page">
        {flashMessage && (
          <FlashMessage
            message={flashMessage}
            type={category}
            setFlashMessage={setFlashMessage}
          />
        )}
        <div className="login-form">
          <div className="left-panel">{children}</div>
          <div className="right-panel">
            <div className="login-headline">
              <h2>
                Get a feel for <br />
                what's going on.
              </h2>
              <p>
                A safe space to reflect on how you are feeling without
                judgement. Helping 3+ million users globally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
