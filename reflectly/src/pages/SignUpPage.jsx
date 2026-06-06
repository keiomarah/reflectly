import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/reflectly-logo.png";
import axios from "axios";
import { FlashMessage } from "../components/FlashMessage";
import { AuthLayout } from "../components/AuthLayout";

function SignUpForm({ setFlashMessage, setCategory }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/signup", {
        name: name,
        surname: surname,
        email: email,
        username: username,
        password1: password1,
        password2: password2,
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
      <h1 className="login-header-text">Create an account.</h1>
      <p className="secondary-text">
        Enter your credentials to create your account.
      </p>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          className={errors.name ? "invalid-input" : ""}
          name="name"
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (name.length < 1) {
              setErrors((prev) => ({
                ...prev,
                name: "Please enter a name.",
              }));
            }
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
        />
        {errors.name && <p className="invalid-input-text">{errors.name}</p>}
        <label>Surname</label>
        <input
          className={errors.surname ? "invalid-input" : ""}
          name="surname"
          onChange={(e) => setSurname(e.target.value)}
          onBlur={() => {
            if (surname.length < 1) {
              setErrors((prev) => ({
                ...prev,
                surname: "Please enter a surname.",
              }));
            }
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, surname: "" }));
          }}
        />
        {errors.surname && (
          <p className="invalid-input-text">{errors.surname}</p>
        )}
        <label>Email</label>
        <input
          className={errors.email ? "invalid-input" : ""}
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            if (!email.includes("@")) {
              setErrors((prev) => ({
                ...prev,
                email: "A valid email address includes '@'.",
              }));
            }
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        {errors.email && <p className="invalid-input-text">{errors.email}</p>}
        <label>Username</label>
        <input
          className={errors.username ? "invalid-input" : ""}
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => {
            if (username.length < 1) {
              setErrors((prev) => ({
                ...prev,
                username: "Please enter a valid username.",
              }));
            } else if (/\s/.test(username.trim())) {
              setErrors((prev) => ({
                ...prev,
                username: "Username must not contain any spaces.",
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
          className={
            errors.password1.length > 0 || errors.password2
              ? "invalid-input"
              : ""
          }
          name="password1"
          type="password"
          onChange={(e) => setPassword1(e.target.value)}
          onBlur={() => {
            let passwordErrors = [];
            if (password1.length < 8) {
              passwordErrors.push("Password must be at least 8 characters.");
            }
            if (!/[a-z]/.test(password1)) {
              passwordErrors.push(
                "Password must contain a lower case character.",
              );
            }
            if (!/[A-Z]/.test(password1)) {
              passwordErrors.push(
                "Password must contain a upper case character.",
              );
            }
            if (!/[^a-zA-Z0-9 ]/.test(password1)) {
              passwordErrors.push("Passowrd must contain a special character.");
            }

            setErrors((prev) => ({ ...prev, password1: passwordErrors }));
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, password1: [] }));
          }}
        />
        {errors.password1?.map((error, index) => (
          <p key={index} className="invalid-input-text">
            {error}
          </p>
        ))}
        <label>Confirm Password </label>
        <input
          className={errors.password2 ? "invalid-input" : ""}
          name="password2"
          type="password"
          onChange={(e) => setPassword2(e.target.value)}
          onBlur={() => {
            if (password1 !== password2) {
              setErrors((prev) => ({
                ...prev,
                password2: "Passwords do not match.",
              }));
            }
          }}
          onFocus={() => {
            setErrors((prev) => ({ ...prev, password2: "" }));
          }}
        />
        {errors.password2 && (
          <p className="invalid-input-text">{errors.password2}</p>
        )}
        <button className="btn-primary login-btn">Log in</button>
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
