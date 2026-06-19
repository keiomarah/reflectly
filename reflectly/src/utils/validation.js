export function validatePasswordMatch(password1, password2) {
  return password1 !== password2 ? "Passwords do not match." : "";
}
export function validateUsername(username) {
  if (username.length < 1) {
    return "Please enter a valid username.";
  } else if (/\s/.test(username.trim())) {
    return "Username must not contain any spaces.";
  }

  return "";
}
export function validateEmail(email) {
  return !email.includes("@") ? "A valid email address includes '@'." : "";
}
export function validateName(name, type) {
  return name.length < 1 ? `Please enter a ${type}` : "";
}
export function validatePassword(password) {
  let passwordErrors = [];
  if (password.length < 8) {
    passwordErrors.push("Password must be at least 8 characters.");
  }
  if (!/[a-z]/.test(password)) {
    passwordErrors.push("Password must contain a lower case character.");
  }
  if (!/[A-Z]/.test(password)) {
    passwordErrors.push("Password must contain a upper case character.");
  }
  if (!/[^a-zA-Z0-9 ]/.test(password)) {
    passwordErrors.push("Passowrd must contain a special character.");
  }

  return passwordErrors;
}
