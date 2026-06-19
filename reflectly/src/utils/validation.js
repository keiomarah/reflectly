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
