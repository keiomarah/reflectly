import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthLayout } from "../components/AuthLayout";
import logo from "../assets/reflectly-logo.png";

/**
 * Displays login form and performs client side validation before submitting the form to the server
 */
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateUsername = () =>
    username.length < 1 ? "Please enter a valid username" : "";

  const validatePassword = () =>
    password.length < 1 ? "Please enter a valid password" : "";

  const validateForm = () => {
    let newErrors = {};

    newErrors.username = validateUsername();
    newErrors.password = validatePassword();

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalErrors = validateForm();
    setErrors(finalErrors);
    if (finalErrors.username || finalErrors.password) {
      toast.error("Invalid credentials. Please try again.");
    } else {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "/api/auth/login",
          {
            username,
            password,
          },
          { withCredentials: true },
        );

        toast.success(response.data.message);
        navigate("/homedashboard");
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Login failed. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <>
      <img src={logo} className="login-logo" alt="Concentric circles logo" />
      <h1 className="login-header-text">Welcome back.</h1>
      <p className="secondary-text">
        Enter your credentials to access your account.
      </p>
      <form id="login-form" noValidate onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          aria-describedby={errors.username ? "username-error" : undefined}
          aria-invalid={!!errors.username}
          className={errors.username ? "invalid-input" : ""}
          required
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              username: validateUsername(),
            }));
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, username: "" }));
          }}
        />
        {errors.username && (
          <p className="invalid-input-text" id="username-error">
            {errors.username}
          </p>
        )}
        <label htmlFor="password">Password </label>
        <input
          id="password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={errors.password ? "invalid-input" : ""}
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              password: validatePassword(),
            }));
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />
        {errors.password && (
          <p className="invalid-input-text" id="password-error">
            {errors.password}
          </p>
        )}
        <button className="btn-primary login-btn" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        <p className="secondary-text">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="register-link">
            Register Now
          </Link>
        </p>
      </form>
    </>
  );
}

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
