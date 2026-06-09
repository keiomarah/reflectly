import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
export function MenuIcon() {
  return (
    <div className="menu">
      <button className="menu-icon">✦</button>
      <nav className="nav-links">
        <ul>
          <li>
            <Link className="link-nav">Home</Link>
          </li>
          <li>
            <Link className="link-nav">Account</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
