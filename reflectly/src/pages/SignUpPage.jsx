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
        Enter your credentials to access your account.
      </p>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" onChange={(e) => setName(e.target.value)} />
        <label>Surname</label>
        <input name="surname" onChange={(e) => setSurname(e.target.value)} />
        <label>Email</label>
        <input
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Username</label>
        <input name="username" onChange={(e) => setUsername(e.target.value)} />

        <label>Password </label>
        <input
          name="password1"
          type="password"
          onChange={(e) => setPassword1(e.target.value)}
        />
        <label>Confirm Password </label>
        <input
          name="password2"
          type="password"
          onChange={(e) => setPassword2(e.target.value)}
        />
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
