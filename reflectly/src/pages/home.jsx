import { Link } from "react-router-dom";

export function Home() {
  return (
    <>
      <h1>This is the home page</h1>
      <Link to="/account">Accounts</Link>
      <Link to="/auth/login">Login</Link>
      <Link to="/auth/signup">Signup</Link>
    </>
  );
}
