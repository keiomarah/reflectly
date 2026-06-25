import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/reflectly-logo.png";
import axios from "axios";
import { AuthLayout } from "../components/AuthLayout";
import toast from "react-hot-toast";
import {
  validatePassword,
  validateName,
  validateEmail,
  validateUsername,
  validatePasswordMatch,
} from "../utils/validation";

const PASSWORD_ERRORS = ["length", "lower", "upper", "special"];

/**
 * Displays sign up form and performs client side validation
 * before submitting the form to the server to create a new account.
 */
function SignUpForm({ setFlashMessage, setCategory }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const finalErrors = {};
    finalErrors.name = validateName(name, "name");
    finalErrors.surname = validateName(surname, "surname");
    finalErrors.username = validateUsername(username);
    finalErrors.password1 = validatePassword(password1);
    finalErrors.password2 = validatePasswordMatch(password1, password2);

    return finalErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalErrors = validateForm();

    if (
      finalErrors.name ||
      finalErrors.surname ||
      finalErrors.username ||
      finalErrors.password1 === [] ||
      finalErrors.password2
    ) {
      setErrors(finalErrors);
    } else {
      try {
        setIsloading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/signup`,
          {
            name: name,
            surname: surname,
            email: email,
            username: username,
            password1: password1,
            password2: password2,
          },
          { withCredentials: true },
        );

        toast.success(response.data.message);

        navigate("/homedashboard");
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setIsloading(false);
      }
    }
  };

  return (
    <>
      <img src={logo} className="login-logo" />
      <h1 className="login-header-text">Create an account.</h1>
      <p className="secondary-text">
        Enter your details to create your account.
      </p>
      <form noValidate onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={errors.name ? "invalid-input" : ""}
          name="name"
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              name: validateName(name, "name"),
            }));
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
        />
        {errors.name && (
          <p className="invalid-input-text" id="name-error">
            {errors.name}
          </p>
        )}
        <label htmlFor="surname">Surname</label>
        <input
          id="surname"
          aria-invalid={!!errors.surname}
          aria-describedby={errors.surname ? "surname-error" : undefined}
          className={errors.surname ? "invalid-input" : ""}
          name="surname"
          onChange={(e) => setSurname(e.target.value)}
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              surname: validateName(surname, "surname"),
            }));
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, surname: "" }));
          }}
        />
        {errors.surname && (
          <p className="invalid-input-text" id="surname-error">
            {errors.surname}
          </p>
        )}
        <label>Email</label>
        <input
          id="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={errors.email ? "invalid-input" : ""}
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        {errors.email && (
          <p className="invalid-input-text" id="email-error">
            {errors.email}
          </p>
        )}
        <label htmlFor="username">Username</label>
        <input
          id="username"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
          className={errors.username ? "invalid-input" : ""}
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              username: validateUsername(username),
            }));
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, username: "" }));
          }}
        />
        {errors.username && (
          <p className="invalid-input-text" id="useername-error">
            {errors.username}
          </p>
        )}
        <label htmlFor="password1">Password </label>
        <input
          id="password1"
          aria-invalid={!(errors?.password1 === [])}
          aria-describedby={`${errors?.password1?.[0] ? "password-error-length" : ""} ${errors?.password1?.[1] ? "password-error-lower" : ""} ${errors?.password1?.[2] ? "password-error-upper" : ""} ${errors?.password1?.[3] ? "password-error-special" : ""}`}
          className={
            errors?.password1?.length > 0 || errors.password2
              ? "invalid-input"
              : ""
          }
          name="password1"
          type="password"
          onChange={(e) => setPassword1(e.target.value)}
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              password1: validatePassword(password1),
            }));
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, password1: [] }));
          }}
        />
        {errors.password1?.map((error, index) => (
          <p
            key={index}
            className="invalid-input-text"
            id={`password-error-${PASSWORD_ERRORS[index]}`}
          >
            {error}
          </p>
        ))}
        <label htmlFor="password2">Confirm Password </label>
        <input
          id="password2"
          aria-invalid={!!errors.password2}
          aria-describedby={
            errors.password2 ? "password-error-match" : undefined
          }
          className={errors.password2 ? "invalid-input" : ""}
          name="password2"
          type="password"
          onChange={(e) => setPassword2(e.target.value)}
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              password2: validatePasswordMatch(password1, password2),
            }));
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, password2: "" }));
          }}
        />
        {errors.password2 && (
          <p className="invalid-input-text" id="password-error-match">
            {errors.password2}
          </p>
        )}
        <button className="btn-primary create-account-btn" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </>
  );
}

export function SignUpPage() {
  const [flashMessage, setFlashMessage] = useState("");
  const [category, setCategory] = useState("");
  return (
    <AuthLayout
      flashMessage={flashMessage}
      category={category}
      setFlashMessage={setFlashMessage}
    >
      <SignUpForm setFlashMessage={setFlashMessage} setCategory={setCategory} />
    </AuthLayout>
  );
}
