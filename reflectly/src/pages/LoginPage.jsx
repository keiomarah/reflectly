import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/reflectly-logo.png";
import axios from "axios";
import { FlashMessage } from "../components/FlashMessage";
import { AuthLayout } from "../components/AuthLayout";

function LoginForm({ setFlashMessage, setCategory }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/login", {
        username: username,
        password: password,
      });
      setTimeout(() => {
        setFlashMessage(response.data.message);
        setCategory(response.data.category);
      }, 0);
    } catch (error) {
      setTimeout(() => {
        setFlashMessage(error.response?.data?.message);
        setCategory(error?.response?.data?.category);
      }, 0);

      console.log(error?.response?.data?.category);
    }
  };
  return (
    <>
      <img src={logo} className="login-logo" />
      <h1 className="login-header-text">Welcome back.</h1>
      <p className="secondary-text">
        Enter your credentials to access your account.
      </p>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          className={errors.username ? "invalid-input" : ""}
          required
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => {
            if (username.length < 1) {
              setErrors((prev) => ({
                ...prev,
                username: "Please enter a valid username.",
              }));
            }
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, username: "" }));
          }}
        />
        {errors.username && (
          <p className="invalid-input-text">{errors.username}</p>
        )}
        <label>Password </label>
        <input
          className={errors.password ? "invalid-input" : ""}
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          onBlur={() => {
            if (password.length < 1) {
              setErrors((prev) => ({
                ...prev,
                password: "Please enter a password.",
              }));
            }
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />
        {errors.password && (
          <p className="invalid-input-text">{errors.password}</p>
        )}
        <button className="btn-primary login-btn">Log in</button>
        <p className="secondary-text">
          Don't have an account?
          <Link to="/auth/signup" className="register-link">
            Register Now
          </Link>
        </p>
      </form>
    </>
  );
}

export function LoginPage() {
  const [flashMessage, setFlashMessage] = useState("");
  const [category, setCategory] = useState("");
  return (
    <AuthLayout
      flashMessage={flashMessage}
      category={category}
      setFlashMessage={setFlashMessage}
    >
      <LoginForm setFlashMessage={setFlashMessage} setCategory={setCategory} />
    </AuthLayout>
  );
}
