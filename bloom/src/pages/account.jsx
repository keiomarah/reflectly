import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "../components/MenuIcon";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "../utils/validation";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PASSWORD_ERRORS = ["length", "lower", "upper", "special"];

function DeleteAccount() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (showConfirmDialog) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [showConfirmDialog]);

  function handleDeleteAccount() {
    setShowConfirmDialog(true);
  }

  async function deleteAccount() {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/auth/user`,
      );
      toast.success(response.data.message);
      navigate("/auth/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error deleting account. Please try again later.",
      );
    }
  }
  return (
    <>
      <dialog ref={dialogRef} className="confirm-delete-dialog">
        <button
          className="close-dialog-btn control-btn"
          onClick={() => {
            setShowConfirmDialog(false);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="confirm-delete-text">
          <h1>Are you sure?</h1>
          <p className="delete-subtext">
            Deleting your account will erase all your account history. This
            action cannot be undone
          </p>
          <div className="confirm-dialog-btns-container">
            <p onClick={deleteAccount}>Confirm</p>
            <p
              onClick={() => {
                setShowConfirmDialog(false);
              }}
            >
              Go Back
            </p>
          </div>
        </div>
      </dialog>
      <p className="delete-account-btn" onClick={handleDeleteAccount}>
        Delete Account
      </p>
    </>
  );
}
function AccountDetails() {
  let user;
  const firstnameRef = useRef(null);
  const lastnameRef = useRef(null);
  const emailRef = useRef(null);
  const currentPasswordRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [originalUser, setOriginalUser] = useState({});
  async function getUserDetails() {
    const firstname = firstnameRef.current;

    const lastname = lastnameRef.current;
    const email = emailRef.current;
    const currentPassword = currentPasswordRef.current;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          withCredentials: true,
        },
      );
      console.log(response.data);
      user = response.data;

      firstname.value = user.name;
      setName(user.name);
      lastname.value = user.surname;
      setSurname(user.surname);
      email.value = user.email;
      setEmail(user.email);
      setOriginalUser((prev) => ({ ...prev, name: user.name }));
      setOriginalUser((prev) => ({ ...prev, surname: user.surname }));
      setOriginalUser((prev) => ({ ...prev, email: user.email }));
      setOriginalUser((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.log(error);
    }
  }
  const hasChanges =
    originalUser.name !== name ||
    originalUser.surname !== surname ||
    originalUser.email !== email ||
    password1 !== "" ||
    password2 !== "";
  useEffect(() => {
    getUserDetails();
  }, []);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/update-user`,
        {
          name,
          surname,
          email,
          password1,
          password2,
        },
        { withCredentials: true },
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error updating account details please try again.",
      );
    } finally {
      getUserDetails();
    }
  };
  return (
    <div className="account-details">
      <form noValidate>
        <h1>Account</h1>
        <fieldset>
          <legend>Full Name</legend>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              required
              id="name"
              ref={firstnameRef}
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
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input
              required
              id="surname"
              ref={lastnameRef}
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
          </div>
        </fieldset>
        <fieldset>
          <legend>Contact Email</legend>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div>
              {/*<div className="form-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>*/}
              <input
                required
                id="email"
                ref={emailRef}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={errors.email ? "invalid-input" : ""}
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  setErrors((prev) => ({
                    ...prev,
                    email: validateEmail(email),
                  }));
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
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Password</legend>
          <div className="form-group">
            <label htmlFor="password1">New Password</label>
            <div>
              {/*<div className="form-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>*/}
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
                  if (password1 !== "") {
                    setErrors((prev) => ({
                      ...prev,
                      password1: validatePassword(password1),
                    }));
                  }
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
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password2">Confirm New Password</label>
            <div>
              {/*<div className="form-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>*/}
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
            </div>
          </div>
        </fieldset>
        <button
          className="btn-primary"
          onClick={(e) => {
            handleSaveChanges(e);
          }}
          disabled={!hasChanges}
        >
          Save Changes
        </button>
      </form>
      <DeleteAccount />
    </div>
  );
}
export function Account() {
  return (
    <div className="account-page">
      <MenuIcon />
      <AccountDetails />
    </div>
  );
}
