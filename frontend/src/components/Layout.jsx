import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <h2>🚀 My Platform</h2>

        <div>
          <Link to="/">Home</Link>
          <Link to="/station/math">Stations</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="content">{children}</div>

      {/* Footer */}
      <footer className="footer">
        © 2026 My Platform | By Ibrahim 🚀
      </footer>
    </>
  );
}

export default Layout;