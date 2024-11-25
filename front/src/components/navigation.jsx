import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../routes/root";

export default function Navigation() {
  const { authenticated } = useContext(AuthContext);
  return (
    <div className="navigation-container">
      <nav className="links-container">
        {!authenticated ? (
          <Link className="link-button" to={`auth`}>
            L
          </Link>
        ) : (
          <>
            <Link className="link-button" to={`receipts`}>
              R
            </Link>
            <Link className="link-button" to={`profile`}>
              P
            </Link>
            <Link className="link-button" to={`chat`}>
              C
            </Link>
          </>
        )}
      </nav>
      <p>WAD Project</p>
    </div>
  );
}
