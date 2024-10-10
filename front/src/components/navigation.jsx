import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div className="navigation-container">
      <nav className="links-container">
        <Link className="link-button" to={`auth`}>
          L
        </Link>
        <Link className="link-button" to={`receipts`}>
          R
        </Link>
        <Link className="link-button" to={`testroute`}>
          T
        </Link>
      </nav>
      <p>WAD Project</p>
    </div>
  );
}
