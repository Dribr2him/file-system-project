import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <>
      <nav className="navbar">
        <h2>🚀 My Platform</h2>

        <div>
          <Link to="/">Home</Link>
          <Link to="/station/math">Math</Link>
          <Link to="/station/physics">Physics</Link>
          <Link to="/station/chemistry">Chemistry</Link>
        </div>
      </nav>

      <div className="content">
        {children}
      </div>

      <footer className="footer">
        © 2026 My Platform | By Ibrahim 🚀
      </footer>
    </>
  );
}

export default Layout;